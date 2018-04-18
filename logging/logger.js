var winston = require('winston');
var WinstonCloudWatch = require('winston-cloudwatch');
var Elasticsearch = require('winston-elasticsearch');
var LogzioWinstonTransport = require('winston-logzio');
var Papertrail = require('winston-papertrail').Papertrail;
var moment = require('moment');
winston.loggers.add('logger1');
winston.loggers.add('logger1');
winston.loggers.add('logger2');
console.info(winston.loggers);

// define the custom settings for each transport (file, console)
var options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
    cloudwatch: {
        logGroupName: 'winston', 
        logStreamName: function () {
            // Spread log streams across dates as the server stays up
            let date = moment(new Date()).format('YYYYMMDD-hh');
            return 'express-server-' + date;
        },
        awsRegion: 'us-east-1',
        errorHandler: function (error) {
            console.info('unhandled error foo');
            console.error(error);

        }
    },
    elasticsearch: {
        level: 'debug',
        clientOpts: {
            host: 'https://search-foo-4fn2rvkj4azwqykecbtyopk2ue.us-east-1.es.amazonaws.com/'
        }
    },
    logzio: {
        token: 'logzio-token',
        host: 'listener.logz.io',
        type: 'winston-example'
    },
    papertrail: {
        host: 'provided by papertail',
        port: 12345,
        hostname: 'winston-01',
    }
};


var winstonPapertrail = new Papertrail(options.papertrail);
winstonPapertrail.on('error', function (err) {
    // Handle, report, or silently ignore connection errors and failures
    console.error(err);
});

winstonPapertrail.on('connect', function (message) {
    logger && logger.info(message);
});
// instantiate a new Winston Logger with the settings defined above
var logger = new winston.Logger({
    transports: [winstonPapertrail],
    exitOnError: false, // do not exit on handled exceptions
});
logger.add(winston.transports.Console, options.console);
logger.add(WinstonCloudWatch, options.cloudwatch);
// logger.add(Elasticsearch, options.elasticsearch);
logger.add(LogzioWinstonTransport, options.logzio);


// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info("HttpRequest", message);
    },
};


module.exports = logger;