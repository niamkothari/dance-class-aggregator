import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { classes, studios } from './data'


const app = express()
const port = 8095
app.use(bodyParser.json())

// set up Pino logging
const logger = pino({
    transport: {
        target: 'pino-pretty'
    }
})
app.use(expressPinoLogger({ logger }))

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