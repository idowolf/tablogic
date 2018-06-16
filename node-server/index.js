const express = require('express')
  , bodyParser = require('body-parser');
const fs = require('fs');
const vogels = require('vogels');
const util = require('util');
const lod = require('lodash');
const AWS = require("aws-sdk");
const PORT = process.env.PORT || 5000;
const app = express();
const Joi = require('joi');
const time = require('time');
const cors = require('cors')


app.use(cors())


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(PORT, function () {
  console.log('Application worker ' + process.pid + ' started...');
}
);

app.post('/', function (request, response, next) {
  let payload = "";
  try {
    payload = JSON.parse(request.body.payload);
  } catch (error) {
    payload = request.body.payload;
  }
  if(isNotTimeForUpload()) {
	  console.log("Midnight. Ignoring request");
	  response.send({ "result": "Midnight. Ignoring request" });
	  return;
  }
  payload.roomId = "1";
  payload.tableId = "1";
  payload.timestamp = getCurrentTimeIsrael();
  var docClient = new AWS.DynamoDB.DocumentClient();

  var table = "tablogic";

  var params = {
    TableName: table,
    Item: payload
  };
  docClient.put(params, function (err, data) {
    let res = "";
    if (err) {
      res = "Unable to add item. Error JSON:" + JSON.stringify(err, null, 2);
      console.error(res);
    } else {
      res = "Added item:" + JSON.stringify(data, null, 2);
      console.log(res);
    }
    response.send({ "result": res });
  });
});

app.get('/getDevice', function (request, response, next) {
  let printResults = function (err, resp) {
    if (err) {
      console.log('Error running query', err);
    } else {
      console.log('Found', resp.Count, 'items');
      const entries = lod.map(resp.Items, 'attrs');
      let payloads = [];

      entries.forEach(function (element) {
        payloads.push(element);
      });
      var res = {};
      res = payloads;
      response.send(res);
    }
  };

  const res = Measure
    .query(request.query.deviceId)
    .where('timestamp').beginsWith(request.query.date)
    .filter('roomId').equals(request.query.roomId)
    .filter('tableId').equals(request.query.tableId)
    .exec(printResults);
})

let awsConfig = {
  accessKeyId: 'ACCESSKEYID',
  secretAccessKey: 'SECRETKEY',
  endpoint: "dynamodb.REGION.amazonaws.com",
  region: "REGION"
}

vogels.AWS.config.update(awsConfig);
AWS.config.update(awsConfig);

var Measure = vogels.define('Measure', {
  hashKey: 'deviceId',
  rangeKey: 'timestamp',
  schema: {
    deviceId: Joi.string(),
    timestamp: Joi.string(),
    hum: Joi.number(),
    mic: Joi.number(),
    prox: Joi.number(),
    slider: Joi.number(),
    temp: Joi.number(),
    roomId: Joi.string(),
  },
});


Measure.config({ tableName: 'tablogic' });




function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

function getCurrentTimeIsrael() {
  var now = new time.Date();

  now.setTimezone("Asia/Jerusalem");
  let res = zero(now.getDate()) +
    "-" +
    zero(now.getMonth() + 1) +
    "-" +
    zero(now.getFullYear()) +
    "-" +
    zero(now.getHours()) +
    ":" +
    zero(now.getMinutes()) +
    ":" +
    zero(now.getSeconds());
    return res;
}

function isNotTimeForUpload() {
  var now = new time.Date();

  now.setTimezone("Asia/Jerusalem");
  let hour = now.getHours();
  return hour >= 0 && hour <= 7;
}

function zero(n) {
  return (n < 10 ? "0" : "") + n;
}
