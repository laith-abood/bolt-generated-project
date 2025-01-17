import { ApplicationError } from '../errors/ApplicationError';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

export class LoggerService {
  private static loggers: ((entry: LogEntry) => void)[] = [];

  // Register a custom logger
  static registerLogger(logger: (entry: LogEntry) => void): void {
    this.loggers.push(logger);
  }

  // Log a message
  static log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    // Console logging
    this.consoleLog(entry);

    // Custom loggers
    this.loggers.forEach((logger) => logger(entry));
  }

  // Specific logging methods
  static debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  static info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  static warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  static error(
    message: string,
    error?: Error | unknown,
    context?: Record<string, unknown>
  ): void {
    const errorObj =
      error instanceof Error
        ? error
        : error instanceof ApplicationError
          ? error
          : new Error(String(error));

    this.log(LogLevel.ERROR, message, context, errorObj);
  }

  static fatal(
    message: string,
    error?: Error | unknown,
    context?: Record<string, unknown>
  ): void {
    const errorObj =
      error instanceof Error
        ? error
        : error instanceof ApplicationError
          ? error
          : new Error(String(error));

    this.log(LogLevel.FATAL, message, context, errorObj);
  }

  // Internal console logging method
  private static consoleLog(entry: LogEntry): void {
    const { level, message, context, error } = entry;

    // Color-coded console logging
    const colorMap = {
      [LogLevel.DEBUG]: '\x1b[37m', // White
      [LogLevel.INFO]: '\x1b[36m', // Cyan
      [LogLevel.WARN]: '\x1b[33m', // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.FATAL]: '\x1b[41m', // Red background
    };

    const color = colorMap[level] || '\x1b[0m';
    const reset = '\x1b[0m';

    // Construct log message
    const logParts = [`${color}[${level}]${reset}`, message];

    // Add context if present
    if (context) {
      logParts.push(JSON.stringify(context));
    }

    // Add error details if present
    if (error) {
      logParts.push(error.stack ? error.stack : String(error));
    }

    // Log based on level
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(...logParts);
        break;
      case LogLevel.INFO:
        console.info(...logParts);
        break;
      case LogLevel.WARN:
        console.warn(...logParts);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(...logParts);
        break;
    }
  }
}
