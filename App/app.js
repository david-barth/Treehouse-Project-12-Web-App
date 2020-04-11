var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var app = express();
var indexRouter = require('./routes/index');


//Set Up Other Dependencies: 
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));


//Set up views engine and integrate router: 
app.use(express.static(path.join(__dirname, 'build')));
app.use('/', indexRouter);


//Listen on port: 
app.listen(9000);



