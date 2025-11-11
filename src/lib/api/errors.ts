import { z } from "zod";
import { errorResponse, validationErrorResponse } from "./response";

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Database Error class
 */
export class DatabaseError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(message, 500, details);
    this.name = "DatabaseError";
  }
}

/**
 * Validation Error class
 */
export class ValidationError extends ApiError {
  constructor(message: string, public errors: any[]) {
    super(message, 400, errors);
    this.name = "ValidationError";
  }
}

/**
 * Not Found Error class
 */
export class NotFoundError extends ApiError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}

/**
 * Centralized error handler for API routes
 * @param error - The error to handle
 * @param context - Context string for logging (e.g., "GET /api/tickets")
 * @returns NextResponse with appropriate error format
 */
export function handleApiError(error: unknown, context: string) {
  // Log error with context
  console.error(`[API Error - ${context}]`, error);

  // Handle custom API errors
  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode, error.details);
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const formattedErrors = error.errors.map((e) => ({
      path: e.path,
      message: e.message,
    }));
    return validationErrorResponse(formattedErrors);
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    // Don't expose internal errors in production
    const message =
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal server error";

    return errorResponse(message, 500, {
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }

  // Handle unknown error types
  return errorResponse("An unexpected error occurred", 500);
}

/**
 * Async error wrapper for API route handlers
 * Automatically catches and handles errors
 * @param handler - The async handler function
 * @param context - Context string for error logging
 * @returns Wrapped handler function
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  handler: T,
  context: string
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error, context);
    }
  }) as T;
}

/**
 * Validates data against a Zod schema and throws ValidationError if invalid
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated and typed data
 * @throws ValidationError if validation fails
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        "Validation failed",
        error.errors.map((e) => ({
          path: e.path,
          message: e.message,
        }))
      );
    }
    throw error;
  }
}

/**
 * Safely parses JSON from request body
 * @param request - NextRequest object
 * @returns Parsed JSON data
 * @throws ApiError if JSON parsing fails
 */
export async function safeParseJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch (error) {
    throw new ApiError("Invalid JSON in request body", 400);
  }
}
