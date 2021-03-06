import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import morganJson from 'morgan-json';
import LoggerFactory from './logging/logger';
import indexRouter from './routes/index';
import usersRouter from './routes/users';

const httpRequestLogger = LoggerFactory.create('HttpRequest');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function (err, req, res, next) {
  logger.error('unhandled error', err);
});
app.use(morgan('combined', {
  stream: {
    write: function (message) {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      httpRequestLogger.info("HttpRequest", message);
    }
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
