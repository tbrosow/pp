var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://localhost/tupp', { useNewUrlParser: true });
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    console.log("we're connected!");

    // User.find({}, function (err, docs) {
    //     console.log("Users: " + JSON.stringify(docs, null, 4));
    // });
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const logRequestStart = (req, res, next) => {
    console.info(`OOO ${req.method} ${req.originalUrl}`)
    next()
}

app.use(logRequestStart)


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.send(200);
    }
    else {
        //move on
        next();
    }
});


// serve static files from template
app.use(express.static(__dirname + '/views'));

app.set('view engine', 'ejs');

// include routes
var routes = require('./routing');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});


// listen on port 8080
app.listen(8089, function () {
    console.log('Express app listening on port 8089');
});