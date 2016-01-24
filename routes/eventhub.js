/* eslint-env node */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {title: '/'});
});

router.post('/generate_signature', function(req, res, next) {
  // create information to create SAS token
  var uri = 'https://' + req.body.namespace + '.servicebus.windows.net' + '/' + req.body.hub_name + '/' + 'messages';
  var key_name = req.body.sender_key_name;
  var key = req.body.sender_key;
  var ttl = req.body.token_ttl;
  var token = create_sas_token(uri, key_name, key, ttl);
  var result = {'token': token};
  res.send(result);
});

router.post('/send', function(req, res, next) {
  var result = {'result': true};
  res.send(result);
});

module.exports = router;

/* private function*/
var moment = require('moment');
var crypto = require('crypto');
function create_sas_token(uri, key_name, key, ttl) {
  // Token expires in one hour
  var expiry = moment().add(ttl, 'minites').unix();
  
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