var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var streetRouter = require('./routers/street');

var app = express();

var PORT = 3030;
var HOST_NAME = 'localhost';
var DATABASE_NAME = 'traffic';

mongoose.connect('mongodb://' + HOST_NAME + '/' + DATABASE_NAME);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());
app.options('*', cors());

app.use('/api/v1', streetRouter);

app.listen(PORT, function () {
  console.log('routes: ' + JSON.stringify(app._router.stack));
  console.log('Listening port ' + PORT);
});
