const winston = require('winston');
const transports = winston.transports;

const {combine, timestamp, printf, colorize} = winston.format;
const logDir = './logs';

const logFormat = printf(info => {
   return `${info.timestamp}|[${info.level.toUpperCase()}]: ${info.message}`;
});

const config = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    },
    colors : {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
};
winston.addColors(config.colors);

const logger = winston.createLogger({
    levels: config.levels,
    level: 'debug',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        logFormat,
        colorize({all: true})
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: logDir + '/combine.log'})
    ]
});

logger.stream = {
    write: message => {
        logger.http(message.substring(0, message.lastIndexOf('\n')));
    }
}

module.exports = logger;