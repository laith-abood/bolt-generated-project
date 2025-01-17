import { z } from 'zod';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { ErrorLogger } from '@/lib/errors/logger';

interface ValidationError {
  path: Array<string | number>;
  message: string;
}

interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

function validateData<T>(
  schema: z.ZodType<T>,
  data: unknown,
  _context?: string
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((error) => ({
        path: error.path,
        message: error.message,
      })),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

interface ValidationMiddlewareOptions<T> {
  schema: z.ZodType<T>;
  handler: (req: NextRequest, data: T) => Promise<Response>;
}

/**
 * Creates a middleware that validates request data against a schema
 * @param options Validation options and request handler
 */
export function withValidation<T>({
  schema,
  handler,
}: ValidationMiddlewareOptions<T>) {
  return async (req: NextRequest): Promise<Response> => {
    try {
      let data: unknown;

      // Parse request body based on content type
      const contentType = req.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await req.json();
      } else if (contentType?.includes('multipart/form-data')) {
        const formData = await req.formData();
        data = Object.fromEntries(formData.entries());
      } else {
        return NextResponse.json(
          { error: 'Unsupported content type' },
          { status: 415 }
        );
      }

      // Validate the request data
      const validationResult = validateData(
        schema,
        data,
        'API Request Validation'
      );

      if (!validationResult.success || !validationResult.data) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: validationResult.errors,
          },
          { status: 400 }
        );
      }

      // Call the handler with validated data
      return handler(req, validationResult.data);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Request processing failed');
      void ErrorLogger.logError(error, {
        url: req.url,
        method: req.method,
        context: 'API Request Handler',
      });

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Creates a middleware that validates query parameters against a schema
 * @param options Validation options and request handler
 */
export function withQueryValidation<T>({
  schema,
  handler,
}: ValidationMiddlewareOptions<T>) {
  return async (req: NextRequest): Promise<Response> => {
    try {
      const url = new URL(req.url);
      const queryParams = Object.fromEntries(url.searchParams.entries());

      // Validate query parameters
      const validationResult = validateData(
        schema,
        queryParams,
        'API Query Validation'
      );

      if (!validationResult.success || !validationResult.data) {
        return NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: validationResult.errors,
          },
          { status: 400 }
        );
      }

      // Call the handler with validated data
      return handler(req, validationResult.data);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Request processing failed');
      void ErrorLogger.logError(error, {
        url: req.url,
        method: req.method,
        context: 'API Query Handler',
      });

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Creates a middleware that validates path parameters against a schema
 * @param options Validation options and request handler
 */
export function withParamsValidation<T>({
  schema,
  handler,
}: ValidationMiddlewareOptions<T>) {
  return async (req: NextRequest): Promise<Response> => {
    try {
      const url = new URL(req.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const params: Record<string, string> = {};

      // Extract path parameters
      for (let i = 0; i < pathSegments.length - 1; i++) {
        const currentSegment = pathSegments[i];
        const nextSegment = pathSegments[i + 1];

        if (
          currentSegment &&
          nextSegment &&
          currentSegment.startsWith('[') &&
          currentSegment.endsWith(']')
        ) {
          const paramName = currentSegment.slice(1, -1);
          params[paramName] = nextSegment;
        }
      }

      // Validate path parameters
      const validationResult = validateData(
        schema,
        params,
        'API Params Validation'
      );

      if (!validationResult.success || !validationResult.data) {
        return NextResponse.json(
          {
            error: 'Invalid path parameters',
            details: validationResult.errors,
          },
          { status: 400 }
        );
      }

      // Call the handler with validated data
      return handler(req, validationResult.data);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Request processing failed');
      void ErrorLogger.logError(error, {
        url: req.url,
        method: req.method,
        context: 'API Params Handler',
      });

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
