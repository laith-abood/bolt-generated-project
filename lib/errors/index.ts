import { ErrorHandler } from './ErrorHandler';
import { ErrorLogger } from './logger';

export * from './ErrorHandler';
export * from './logger';

// Create a convenience function for error handling
export const errorService = {
  handleError: ErrorHandler.handleError.bind(ErrorHandler),
  logError: ErrorLogger.logError.bind(ErrorLogger),
};
