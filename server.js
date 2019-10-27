var express = require('express');
var bodyParser = require('body-parser');
var app = express();

require('dotenv').config()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function verifyWebhook(req, res) {
  var VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  var mode = req.query['hub.mode'];
  var token = req.query['hub.verify_token'];
  var challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
}

function processMessageHandler(req, res) {
  // fb expects 200 for every message asap
  res.sendStatus(200);
  console.log(JSON.stringify(req.body, null, 2));
}

app.get('/', verifyWebhook);
app.post('/', processMessageHandler);

app.listen(5000, function() { console.log('Express server is listening on port 5000') });
