export class ApplicationError extends Error {
  constructor(
    public code: string,
    message: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApplicationError';
  }

  static fromError(error: Error, code = 'UNKNOWN_ERROR'): ApplicationError {
    return new ApplicationError(code, error.message, {
      originalError: error,
    });
  }
}

export class ErrorHandler {
  static handle(error: Error, context?: Record<string, unknown>): void {
    const appError =
      error instanceof ApplicationError
        ? error
        : ApplicationError.fromError(error);

    console.error(
      JSON.stringify(
        {
          code: appError.code,
          message: appError.message,
          context: {
            ...context,
            timestamp: new Date().toISOString(),
          },
        },
        null,
        2
      )
    );

    // TODO: Implement more robust logging mechanism
    // Consider integrating with monitoring service
  }
}
