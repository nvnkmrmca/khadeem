const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const dbConfig = require('./config/database.js');
const mongoose = require('mongoose');

var app = express();
var port = process.env.PORT || 3001;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// allow cross origin
app.use(cors({credentials: true, origin: true}));

mongoose.Promise = global.Promise;

// connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// simple route
// app.get('/', (req, res) => {
//     res.json({"message": "api is alive."});
// });

//server static files
app.use(express.static('assets'));
app.use(express.static('web'));

// simple route
app.get('/', (req, res) => {
    res.json({"message": "api is alive."});
});

// routes
require('./route')(app);

// listen for requests
app.listen(port, () => {
    console.log("API Server is listening on port " + port);
});