const winston = require('winston');
const path = require('path');
const rootPath = path.resolve(__dirname);


function getLogger(className) {
    return  winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format(info => {
                info.message = `${className.padEnd(25, ' ')}: ${info.message}`;
                return info;
            })(),
            winston.format.simple()
        ),
        transports: [
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log' }),
            new winston.transports.Console()
        ],
    });

}

module.exports = { getLogger };