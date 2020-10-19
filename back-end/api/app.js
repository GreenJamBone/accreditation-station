var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var user = require('./routes/routes-user');
var requirements = require('./routes/routes-audit-reqs');
var courses = require('./routes/routes-course');
var documents = require('./routes/routes-document');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api/user', user);
app.use('/api/requirement', requirements);
app.use('/api/course', courses);
app.use('/api/document', documents);

module.exports = app;
