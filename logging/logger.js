var winston = require('winston');
var WinstonCloudWatch = require('winston-cloudwatch');
var moment = require('moment');

// define the custom settings for each transport (file, console)
var options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
    cloudwatch: {
        logGroupName: 'winston', // REQUIRED
        logStreamName: function() {
            // Spread log streams across dates as the server stays up
            let date = moment(new Date()).format('YYYYMMDD-hh');
            return 'express-server-' + date;
          },
        awsRegion: 'us-east-1',
        errorHandler: function(error) {
            console.info('unhandled error foo');
            console.error(error);
            
        }
    }
};


// instantiate a new Winston Logger with the settings defined above
var logger = new winston.Logger({
    exitOnError: false, // do not exit on handled exceptions
});
logger.add(winston.transports.Console, options.console);
logger.add(WinstonCloudWatch, options.cloudwatch);

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
        logger.debug('hello');
    },
};


module.exports = logger;