import { ErrorLogger } from './logger';

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'
  | 'NETWORK_ERROR';

export interface ErrorMetadata {
  code?: ErrorCode;
  context?: Record<string, unknown>;
  userId?: string;
  requestId?: string;
  timestamp?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export interface ErrorResponse {
  status: number;
  message: string;
  code?: ErrorCode;
  metadata?: ErrorMetadata;
}

export class ErrorHandler {
  private static getStatusCode(code: ErrorCode): number {
    switch (code) {
      case 'UNAUTHORIZED':
        return 401;
      case 'FORBIDDEN':
        return 403;
      case 'NOT_FOUND':
        return 404;
      case 'VALIDATION_ERROR':
        return 400;
      case 'NETWORK_ERROR':
        return 503;
      case 'INTERNAL_ERROR':
      default:
        return 500;
    }
  }

  private static getErrorCode(error: Error): ErrorCode {
    if (
      error.message.includes('unauthorized') ||
      error.message.includes('unauthenticated')
    ) {
      return 'UNAUTHORIZED';
    }
    if (
      error.message.includes('forbidden') ||
      error.message.includes('permission')
    ) {
      return 'FORBIDDEN';
    }
    if (error.message.includes('not found') || error.message.includes('404')) {
      return 'NOT_FOUND';
    }
    if (
      error.message.includes('validation') ||
      error.message.includes('invalid')
    ) {
      return 'VALIDATION_ERROR';
    }
    if (
      error.message.includes('network') ||
      error.message.includes('connection')
    ) {
      return 'NETWORK_ERROR';
    }
    return 'INTERNAL_ERROR';
  }

  public static getErrorResponse(
    error: Error,
    metadata?: ErrorMetadata
  ): ErrorResponse {
    const code = metadata?.code || ErrorHandler.getErrorCode(error);
    const status = ErrorHandler.getStatusCode(code);

    return {
      status,
      message: error.message,
      code,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    };
  }

  public static async handleError(
    error: Error,
    metadata?: ErrorMetadata
  ): Promise<void> {
    const errorResponse = ErrorHandler.getErrorResponse(error, metadata);
    await ErrorLogger.logError(errorResponse);
  }
}
