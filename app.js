'use strict'

const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const Jwt = require('jsonwebtoken')
const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

const routes = require('./app/routes/router')

const NODE_ENV = process.env.NODE_ENV || 'developement'

const app = express()

// CONFIG
app.use(cors())
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({extended: false}))

// Mongoose
const database = (NODE_ENV !== 'test') ? 'pkap_todolists': 'pkap_test'
const mongodbHost = process.env.MONGODB_URL || `127.0.0.1:27017/${database}`
Mongoose.connect(`mongodb://${mongodbHost}`, {useMongoClient: true})

//Authenticate
app.use(function (req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        Jwt.verify(req.headers.authorization.split(' ')[1], 'crudtest', (err, decode) => {
            if (err) {
                req.user = null
            }
            req.user = decode
            next()
        })
    } else {
        req.user = null
        next()
    }
})

// Routes
app.use('/api', routes)

// RUN
const port = 3000
const callback = () => console.log(`SERVER IS RUNNING AT PORT ${port}.`)
app.listen(port, callback)

module.exports = app
