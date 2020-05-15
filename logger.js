var winston = require('winston');

function logger(environment) {
    var path = __dirname;
    if (environment === 'local' || environment === 'production') {
        path = path + '/';
    } else if (environment === 'test') {
        path = path + '/public/';
    }

    return winston.createLogger({
        levels: winston.config.npm.levels,
        format: winston.format.simple(),
        transports: [
            new (winston.transports.Console)({
                json: false,
                timestamp: true,
                level: 'info'
            }), new winston.transports.File({
                filename: path + 'debug.log',
                json: false
            })],
        exceptionHandlers: [
            new (winston.transports.Console)({
                json: false,
                timestamp: true,
                level: 'error'
            }), new winston.transports.File({
                filename: path + 'exceptions.log',
                json: false
            })],
        exitOnError: false
    });

}

module.exports.logger = logger;