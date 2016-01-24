/*eslint-env node*/

var express = require('express');
var router = express.Router();

var routes_eventhub = require('./eventhub');
router.use('/eventhub', routes_eventhub);

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Azure Event Hub Tool'});
});

module.exports = router;