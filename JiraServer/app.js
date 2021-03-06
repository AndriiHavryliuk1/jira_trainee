'use strict';

const express = require('express');
const app = express();
const morganLog = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const CORS = require('cors');
const bluebird = require('bluebird');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");

const usersRoute = require('./api/routes/users/users');
const tasksRoute = require('./api/routes/tasks');
const boardColumnsRoute = require('./api/routes/boardColumns');
const boardsRoute = require('./api/routes/boards');
const configuration = require('./config/configuration');
const loginRoute = require('./api/routes/login');
const auth = require("./authorization/auth.js")();

setDBConnection();

mongoose.Promise = bluebird;

app.use(morganLog('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(auth.initialize());

// Allow CORS
app.use(CORS());

app.use('/users', usersRoute);
app.use('/boardColumns', auth.authenticate(), boardColumnsRoute);
app.use('/boards', boardsRoute);
app.use('/tasks', tasksRoute);


app.use("/login", loginRoute);

// handle 404 errors
app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});


// handle all errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;

function setDBConnection() {
    switch (process.env.DB) {
        case 'dev':
            mongoose.connect(configuration.DEV.DB_CONNECTION);
            break;
        case 'tests':
            mongoose.connect(configuration.TESTS.DB_CONNECTION);
            break;
        default:
            mongoose.connect(configuration.DEV.DB_CONNECTION);
    }
}