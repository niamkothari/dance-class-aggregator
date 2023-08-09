import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinotLogger from 'express-pino-logger'
import { classes, studios } from './data'
import { Class } from './data'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Issuer, Strategy } from 'openid-client'
import passport from 'passport'
import { runScraper, fetchData, parseHTML, extractClassesInfo, extractStartTime, extractEndTimes } from './scraper'


const app = express()
const port = 8095
app.use(bodyParser.json())

// set up Pino logging
// const logger = pino({
//     transport: {
//         target: 'pino-pretty'
//     }
// })
// app.use(expressPinotLogger({ logger }))

// start server
app.listen(port, () => {
    console.log(`Dance class aggregator listening on port ${port}`)
})


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