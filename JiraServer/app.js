'use strict';

const express = require('express');
const app = express();
const morganLog = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const CORS = require('cors');
const bluebird = require('bluebird');

const usersRoute = require('./api/routes/users/users');
const tasksRoute = require('./api/routes/tasks');
const boardColumnsRoute = require('./api/routes/boardColumns');
const boardsRoute = require('./api/routes/boards');

mongoose.connect(`mongodb://admin:admin@jiratrainee-shard-00-00-stvuc.mongodb.net:27017,jiratrainee-shard-00-01-stvuc.mongodb.net:27017,jiratrainee-shard-00-02-stvuc.mongodb.net:27017/test?ssl=true&replicaSet=JiraTrainee-shard-0&authSource=admin`)

mongoose.Promise = bluebird;

app.use(morganLog('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allow CORS
app.use(CORS());

app.use('/users', usersRoute);
app.use('/boardColumns', boardColumnsRoute);
app.use('/boards', boardsRoute);
app.use('/tasks', tasksRoute);

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