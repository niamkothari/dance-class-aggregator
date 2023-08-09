import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinotLogger from 'express-pino-logger'
import { classes, studios } from './data'
import { Class } from './data'
import { Collection, Db, MongoClient } from 'mongodb'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Issuer, Strategy } from 'openid-client'
import passport from 'passport'
import { keycloak } from './secrets'

// hack to connect Docker's localhost to our localhost to allow access keycloak at localhost:8081 on laptop
if (process.env.PROXY_KEYCLOAK_TO_LOCALHOST) {
    require("http-proxy").createProxyServer({ target: "http://keycloak:8080" }).listen(8081)
}

// set up Mongo
const mongoUrl =  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(mongoUrl)
let db: Db
let administrators: Collection
let danceClasses: Collection
let instructors: Collection
let danceStudios: Collection

// set up Express
const app = express()
const port = parseInt(process.env.PORT) || 8095
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up Pino logging
const logger = pino({
    transport: {
        target: 'pino-pretty'
    }
})
app.use(expressPinotLogger({ logger }))

// set up session
app.use(session({
    secret: 'a just so-so secret',          // check if this can be changed
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    
    // comment out store to default to memory-bases store,
    // which won't persist across load-balancer and will be
    // refreshed at restart of the server
    store: MongoStore.create({
        mongoUrl,
        ttl: 14 * 24 * 60 * 60 // 14 days
    })
}))
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user: any, done: any) => {
    logger.info("serializeUser " + JSON.stringify(user))
    done(null, user)
})
passport.deserializeUser((user: any, done: any) => {
    logger.info("deserializeUser " + JSON.stringify(user))
    done(null, user)
})


// isAuthenticated() uses passport.js to check whether current session has authenticated user
function checkAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if (!req.isAuthenticated()) {
        res.sendStatus(401)
        return
    }
    next()
}

app.get("/api/classes", (req, res) => {
    // query db to get all classes

    res.status(200).json(classes)
})

app.get("/api/studios", (req, res) => {
    // query db to get all studios

    res.status(200).json(studios)
})

app.post("/api/new-class", (req, res) => {
    const newClass = req.body
    // send to db
    res.status(200).json({status: 'ok'})
})

// starts mongo connection, logic for authenticating admins, starts server
client.connect().then(() => {
    logger.info('Successful connection to MongoDB')
    db = client.db('Dance-class-aggregator-DB')
    administrators = db.collection('Admins')
    danceClasses = db.collection('Classes')
    instructors = db.collection('Instructors')
    danceStudios = db.collection('Studios')

    Issuer.discover("http://127.0.0.1:8081/auth/realms/dance-class-aggregator/.well-known/openid-configuration").then(issuer => {
        const client = new issuer.Client(keycloak)

        passport.use('oidc', new Strategy(
            {
                client,
                params: {
                    prompt: 'login'
                }
            },
            async(tokenSet: any, userInfo: any, done: any) => {
                logger.info("oidc" + JSON.stringify(userInfo))

                const email = userInfo.email
                const admin = await administrators.findOne({ email: email})
                if (admin != null) {
                    userInfo.roles = ['administrator']
                } 
                return done(null, userInfo)
            }
        ))

        app.get(
            "/api/admin-login", 
            passport.authenticate("oidc", { failureRedirect: "/api/admin-login" }),
            (req, res) => res.redirect("/")
        )

        app.get(
            "/api/admin-login-callback",
            passport.authenticate("oidc", 
            {
                successRedirect: "/",
                failureRedirect: "/api/admin-login"
            })
        )

        // start server
        app.listen(port, () => {
            logger.info(`Dance class aggregator listening on port ${port}`)
        })
    })
})