import type { ErrorResponse } from './ErrorHandler';

export class ErrorLogger {
  private static async logToService(error: ErrorResponse): Promise<void> {
    // In a real application, you would send this to your logging service
    console.error('Error:', {
      status: error.status,
      message: error.message,
      code: error.code,
      metadata: error.metadata,
    });
  }

  public static async logError(
    error: Error | ErrorResponse,
    context?: Record<string, unknown>
  ): Promise<void> {
    const errorResponse =
      'status' in error
        ? error
        : {
            status: 500,
            message: error.message,
            metadata: {
              ...context,
              timestamp: new Date().toISOString(),
            },
          };

    await ErrorLogger.logToService(errorResponse);
  }
}
