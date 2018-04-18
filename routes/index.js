var express = require('express');
var router = express.Router();
var logger = require('../logging/logger');

/* GET home page. */
router.get('/', function(req, res, next) {
  logger.info('hello foo', { foo: 'daniel' });
  res.render('index', { title: 'Express' });
});

module.exports = router;
