var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var app = express();
var indexRouter = require('./routes/index');

//Set up views engine and integrate router: 
app.use('/', express.static(path.join(__dirname, 'build')));

//Set Up Other Dependencies: 
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Integrate other routes: 
app.use('/', indexRouter);


//Serve static react files if other requests not triggered: 
/*app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});*/

//Listen on port: 
app.listen(process.env.PORT || 9000);




//Continuation: Look up treehouse course. 