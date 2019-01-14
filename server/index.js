const express = require('express')
const consola = require('consola')
var path = require('path');
const {
    Nuxt,
    Builder
} = require('nuxt')
const app = express()
const configEnv = require('./config/env')()

const mongoose = require('mongoose');
const session = require('express-session');
const connectMongo = require('connect-mongo')(session);
var logger = require('morgan');
const bodyParser = require('body-parser');
app.set('port', configEnv.port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

//===========================================================================================
//Require router
//===========================================================================================
var indexRouter = require('./routers/index');
var userRouter = require('./routers/user');
//===========================================================================================
//database conect
mongoose.connect(configEnv.dbConnection);


async function start() {
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    app.use(session({
        secret: "nguyenthanhtung",
        resave: false,
        saveUninitialized: false,
        store: new connectMongo({
            mongooseConnection: mongoose.connection
        }),
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        } //24 gio x 60 phut x 60 giay x1000 mili giay = 1 ngay
    }));

    app.use('/api/', indexRouter);
    app.use('/api/users', userRouter);

    // Init Nuxt.js
    const nuxt = new Nuxt(config)

    // Build only in dev mode
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    }

    // Give nuxt middleware to express
    app.use(nuxt.render)

    // Listen the server
    app.listen(configEnv.port, configEnv.host)
    consola.ready({
        message: `Server listening on http://${configEnv.host}:${configEnv.port}`,
        badge: true
    })
}
start()