var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var BlackJackController = require('./api/BlackJackController');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blackjack');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var router = express.Router();

// Work around to allow same origin requests
app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});

// all of our routes will be prefixed with /api
app.use('/api', router);

//Declare routes here
router.get('/history/:playerId', BlackJackController.getPlayerHistory);
router.post('/record', BlackJackController.postGameRecord);

app.listen(port);
console.log('Listening on port ' + port);