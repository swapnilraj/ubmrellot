var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var app = express();

var weather = require('./weather');

require('dotenv').config()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//////////////////////////////////////////////////////////////////////////////
// EXTRACTORS
function getMessage(data) { return data['entry'][0]['messaging'][0]['message']['text']; }
function getSenderID(data) { return data['entry'][0]['messaging'][0]['sender']['id']; }
function getDatetime(data) {
  try {
    return data['entry'][0]['messaging'][0]['message']['nlp']['entities']['datetime'][0]['value'];
  } catch {
    return null;
  }
}

function getLocation(data) {
  try {
    return data['entry'][0]['messaging'][0]['message']['nlp']['entities']['location'][0]['value'];
  } catch {
    return null;
  }
}
//////////////////////////////////////////////////////////////////////////////
// Message Utility
function respond(id, msg) {
  var URL =
    `https://graph.facebook.com/v3.2/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;

  return axios.post(URL, {
    messaging_type: 'RESPONSE',
    recipient: { id },
    message: { text: msg }
  })
  .catch(e => console.log(`Failed to send response to user ${id}: ${e}`));
}
//////////////////////////////////////////////////////////////////////////////

function verifyWebhook(req, res) {
  var VERIFY_TOKEN = process.env.VERIFY_TOKEN
    , mode = req.query['hub.mode']
    , token = req.query['hub.verify_token']
    , challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
}

async function processMessageHandler(req, res) {
  // fb expects 200 for every message asap
  res.sendStatus(200);

  var loc = getLocation(req.body)
    , time = getDatetime(req.body)
    , senderID = getSenderID(req.body);

  var forecast = await weather.forecast(loc, time);
  respond(senderID, forecast);
  console.log(JSON.stringify(req.body, null, 2));
}

app.get('/', verifyWebhook);
app.post('/', processMessageHandler);

app.listen(80, function() { console.log('Express server is listening on port 5000') });
