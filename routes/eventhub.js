/* eslint-env node */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {title: '/'});
});

router.post('/generate_signature', function(req, res, next) {
  // create data for event hub
  var data = createEventHubData(req);

  // create information to create SAS token
  var token = createSasToken(data.uri, data.key_name, data.key, data.ttl);
  var result = {'token': token};
  res.send(result);
});

router.post('/send_event', function(req, res, next) {
  // create data for event hub
  var data = createEventHubData(req);

  // create information to create SAS token
  var token = createSasToken(data.uri, data.key_name, data.key, data.ttl);

  // Send Event
  sendEvent(data, token);
  res.send();
});

module.exports = router;

/**** private function ****/
var moment = require('moment');
var crypto = require('crypto');
var https = require('https');

/**
 * Create SAS token
 * 
 * @param string uri
 * @param string key_name
 * @param string key
 * @param string ttl
 * @return string SAS token
 */
function createSasToken(uri, key_name, key, ttl) {
  // Token expires in one hour
  var expiry = moment().add(parseInt(ttl, 10), 'minutes').unix();
  
  var string_to_sign = encodeURIComponent(uri) + '\n' + expiry;
  var hmac = crypto.createHmac('sha256', key);
  hmac.update(string_to_sign);
  var signature = hmac.digest('base64');
  var token = 'SharedAccessSignature sr=' + encodeURIComponent(uri) + 
    '&sig=' + encodeURIComponent(signature) +
    '&se=' + expiry + 
    '&skn=' + key_name;
    
  return token;
}

/**
 * Create data for event hub
 * 
 * @param array req
 * @return array data for event hub
 */
function createEventHubData(req) {
  var hostname = req.body.namespace + '.servicebus.windows.net';
  
  var data = {
    hostname: hostname,
    uri: 'https://' + hostname + '/' + req.body.hub_name + '/' + 'messages',
    key_name: req.body.sender_key_name,
    key: req.body.sender_key,
    ttl: req.body.token_ttl,
    payload: req.body.payload,
    };

  return data;
}

/**
 * Send Event to Azure Event Hub
 * 
 * @param array data
 * @param string token
 */
function sendEvent(data, token) {
  var options = {
    hostname: data.hostname,
    port: 443,
    path: data.uri,
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Length': data.payload.length,
      'Content-Type': 'application/atom+xml;type=entry;charset=utf-8'
    }
  };
  console.log("==== options = " + JSON.stringify(options));

  var req = https.request(options, function(res) {
    console.log("==== statusCode: ", res.statusCode);
    console.log("==== headers: ", res.headers);

    res.on('data', function(d) {
      process.stdout.write(d);
    });
  });
  
  req.on('error', function(e) {
    console.error(e);
  });  

  req.write(data.payload + '\n');
  req.end();
}