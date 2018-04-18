var express = require('express');
var router = express.Router();
var logger = require('../logging/logger');

/* GET users listing. */
router.get('/', function(req, res, next) {
  logger.info('users bar', { bar: 'big' });
  res.send('daniel');
});

module.exports = router;
