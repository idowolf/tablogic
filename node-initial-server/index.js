const express = require('express')
  , bodyParser = require('body-parser');
  
// process.env.PORT || 5000
const PORT = 3000
const app = express();
const awsIot = require('aws-iot-device-sdk');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var device = awsIot.device({
   keyPath: "./private.pem.key",
  certPath: "./cert.pem.crt",
    caPath: "./root.pem.crt",
  clientId: "arn:aws:iot:REGION:CODE:THINGPATH",
      host: "YOURID.iot.REGION.amazonaws.com"
});

// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//

device.on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });

device.on('connect', function() {
		console.log('connect');
		device.subscribe('sdk/test/Python');
		app.post('/', function(request, response) {
			let payload = JSON.parse(request.body.payload);
			device.publish('sdk/test/Python', JSON.stringify({ deviceId: payload.deviceId, timestamp: (new Date()).toUTCString(), mic:payload.mic, prox:payload.prox, temp:payload.temp, hum:payload.hum, slider:payload.slider}));
			console.log(payload);
			response.send({"result":"ok"});
		})
  });

  //  || 'localhost'
app.listen(PORT,'0.0.0.0',function() {
    console.log('Application worker ' + process.pid + ' started...');
  }
  );
//device.publish('sdk/test/Python', JSON.stringify({ deviceId: 1, timestamp: "2018-05-05 22:59:30", value:40}));