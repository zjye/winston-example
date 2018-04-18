import express from 'express';
import LoggerFactory from '../logging/logger';

const router = express.Router();
const logger = LoggerFactory.create('UserLogger');

/* GET users listing. */
router.get('/', function(req, res, next) {
  logger.info('users bar', { bar: 'big' });
  res.send('daniel');
});

module.exports = router;
