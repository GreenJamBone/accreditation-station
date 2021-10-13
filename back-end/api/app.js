const config = require('config');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const constants = require('./constants');

var user = require('./routes/routes-user');
var requirements = require('./routes/routes-audit-reqs');
var courses = require('./routes/routes-course');
var documents = require('./routes/routes-document');
var assignments = require('./routes/routes-assignment');
var userReg = require('./routes/routes-user-reg');
var auth = require('./routes/routes-auth');

var app = express();

if (!config.get('PrivateKey')) {
    console.error('FATAL ERROR: PrivateKey is not defined.');
    process.exit(1);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());



app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,x-access-token,content-type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  })

app.use('/api/user', user);
app.use('/api/requirement', requirements);
app.use('/api/course', courses);
app.use('/api/document', documents);
app.use('/api/assignment', assignments);
app.use('/api/user-reg', userReg);
app.use('/api/auth', auth);

module.exports = app;
