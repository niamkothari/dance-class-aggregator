import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinotLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
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
let danceInstructors: Collection
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
    secret: 'a just so-so secret',
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

/** Verifies that the current session has an authenticated user */
function checkAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if (!req.isAuthenticated()) { // isAuthenticated() uses passport.js
        res.sendStatus(401)
        return
    }
    next()
}

/** Logs out current user and redirects to home page */
app.post(
    "/api/logout",
    (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err)
            res.redirect("/")
        })
    }
)

/** Returns user if current session has a user */ 
app.get("/api/user", (req, res) => {
    res.json(req.user || {})
})

/** Returns administrator if current session has a user and that user is a verified admin */
app.get("/api/administrator", checkAuthenticated, async(req, res) => {
    const email = req.user.email
    const admin = await administrators.findOne({ email: email })
    if (admin === null) {
        res.status(404).json({email})
        return
    }
    res.status(200).json(admin)
})

/** Returns all classes */
app.get("/api/classes", async (req, res) => {
    const classes = await danceClasses.find({}).toArray()
    res.status(200).json(classes)
})

/** Returns classes based on filtering request */
app.get("/api/filteredClasses", async (req, res) => {
    const filters = req.body    // filters object, ex: filters{ studios: [Brickhouse, BDC], instructors: [Bo Park], styles: []}
    if (filters.studios.length === 0 && filters.instructors.length === 0 && filters.styles.length === 0) {
        res.status(400).json({status: "No filters provided"})
        return
    }

    const query: any = {}
    if (filters.studios.length > 0) {
        query["studio"] = {$in: filters.studios}
    }
    if (filters.instructors.length > 0) {
        query["instructor"] = {$in: filters.instructors}
    }
    if (filters.styles.length > 0) {
        query["style"] = {$in: filters.styles}
    }
    const classes = await danceClasses.find(query).toArray()
    res.status(200).json(classes)
})

/** Returns all studios */
app.get("/api/studios", async (req, res) => {
    const studios = await danceStudios.find({}).toArray()
    res.status(200).json(studios)
})

/** Returns all instructors */
app.get("/api/instructors", async (req, res) => {
    const instructors = await danceInstructors.find({}).toArray()
    res.status(200).json(instructors)
})

/** Inserts new class into the database. Must be an admin */
app.post("/api/new-class", checkAuthenticated, async (req, res) => {
    const email = req.user.email
    const admin = await administrators.findOne({ email: email })
    if (admin === null) {
        res.status(401).json({status: "Unauthorized access"})
        return
    }
    const newClass = req.body
    await danceClasses.updateOne(
        {
            name: newClass.name
        },
        {
            $set: {
                name: newClass.name,
                instructor: newClass.instructor,
                studio: newClass.studio,
                style: newClass.style,
                day: newClass.day,
                time: newClass.time
            }
        },
        {
            upsert: true
        }
    )
    res.status(200).json({status: 'ok'})
})

/** Initiates mongo connection, logic for authenticating admins with Keycloak, starts server */ 
client.connect().then(() => {
    logger.info('Successful connection to MongoDB')
    db = client.db('danceClassAggregatorDB')
    administrators = db.collection('admins')
    danceClasses = db.collection('Classes')
    danceInstructors = db.collection('Instructors')
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