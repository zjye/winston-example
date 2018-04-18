import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import Elasticsearch from 'winston-elasticsearch';
import LogzioWinstonTransport from 'winston-logzio';
import {Papertrail} from 'winston-papertrail';
import moment from 'moment';


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
        }
    },
    logzio: {
        host: 'listener.logz.io',
        type: 'winston-example'
    },
    papertrail: {
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


const LoggerFactory =  {

    create: function(loggerName) {
        winston.loggers.add(loggerName, {
            exitOnError: false,
            transports: [
                new winston.transports.Console(options.console),
                winstonPapertrail
            ]
        });   
        return winston.loggers.get(loggerName);
    }
};
export default LoggerFactory;