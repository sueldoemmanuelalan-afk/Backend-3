import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red bold',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    http: 'magenta',
    debug: 'white'
  }
};

winston.addColors(customLevels.colors);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    ({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`
  )
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`
  )
);

const errorRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join('logs', 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
  format: fileFormat
});

const environment = process.env.NODE_ENV || 'development';

export const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: environment === 'development' ? 'debug' : 'info',
      format: consoleFormat
    }),
    errorRotateTransport
  ]
});

export const httpLogger = (req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
};