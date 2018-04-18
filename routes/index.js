import express from 'express';
import LoggerFactory from '../logging/logger';

const router = express.Router();
const logger = LoggerFactory.create('IndexLogger');

/* GET home page. */
router.get('/', function(req, res, next) {
  logger.info('hello foo', { foo: 'daniel' });
  res.render('index', { title: 'Express' });
});

module.exports = router;
