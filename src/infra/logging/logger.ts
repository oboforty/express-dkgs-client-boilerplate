import winston from 'winston';

import { WinstonLoggerOptions } from './logger.types';

// winston-daily-rotate-filewinston-daily-rotate-file

// type SuperLogger = winston.Logger & {
//   detail(log: string, metadata: object): void;
// };

// create logger here to guarantee its existance in case other modules declare it outside of init func
const _logger = winston.loggers.add('default', {
  transports: [],
  exitOnError: false,
});

function formatLogs(info: winston.Logform.TransformableInfo): string {
  const { timestamp, level, message, label, ...metadata } = info;

  const log: Array<string> = [
    `[${[info.timestamp]}] ${info.level.toUpperCase()} - ${info.label}: ${info.message}`
  ];

  for (let [key, val] of Object.entries(metadata)) {

    if (val instanceof Object || val instanceof Array)
      val = JSON.stringify(val);

    log.push(`   * ${key}: ${val}`);
  }

  if (log.length > 1)
    log.push("----------------------------------------------------------");

  return log.join("\n");
}

export function initLogging(opts: WinstonLoggerOptions): winston.Logger {
  //const loggerTransports: Array<winston.transport> = _logger.transports;

  if (opts.log_insts.console) {
    _logger.add(new winston.transports.Console({
      level: opts.log_insts.console.level,
      format: winston.format.combine(
        winston.format.label({
          label: opts.label
        }),
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }));
  }

  if (opts.log_insts.file) {
    _logger.add(new winston.transports.File({
      level: opts.log_insts.file.level,
      filename: opts.log_insts.file.file_path,
      format: winston.format.combine(
        winston.format.label({
          label: opts.label
        }),
        winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
        winston.format.align(),
        //winston.format.errors(),
        winston.format.printf(formatLogs)
      )
    }));
  }

  return _logger;
}
