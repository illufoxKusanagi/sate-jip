import { NextResponse } from "next/server";

/**
 * Standardized API Response Interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

/**
 * Creates a successful API response
 * @param data - The data to return
 * @param message - Optional success message
 * @param count - Optional count for paginated results
 * @returns NextResponse with standardized format
 */
export function successResponse<T>(
  data: T,
  message?: string,
  count?: number
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (message) response.message = message;
  if (count !== undefined) response.count = count;

  return NextResponse.json(response);
}

/**
 * Creates an error API response
 * @param error - Error message
 * @param status - HTTP status code (default: 500)
 * @param details - Optional additional error details
 * @returns NextResponse with error format
 */
export function errorResponse(
  error: string,
  status: number = 500,
  details?: unknown
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error,
  };

  if (details && process.env.NODE_ENV === "development") {
    (response as any).details = details;
  }

  return NextResponse.json(response, { status });
}

/**
 * Creates a validation error response
 * @param errors - Array of validation errors
 * @returns NextResponse with 400 status
 */
export function validationErrorResponse(
  errors: Array<{ path: (string | number)[]; message: string }>
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      details: errors,
    },
    { status: 400 }
  );
}

/**
 * Creates a not found error response
 * @param resource - Name of the resource that wasn't found
 * @returns NextResponse with 404 status
 */
export function notFoundResponse(resource: string = "Resource"): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: `${resource} not found`,
    },
    { status: 404 }
  );
}

/**
 * Creates an unauthorized error response
 * @param message - Optional custom message
 * @returns NextResponse with 401 status
 */
export function unauthorizedResponse(
  message: string = "Unauthorized"
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 401 }
  );
}

/**
 * Creates a forbidden error response
 * @param message - Optional custom message
 * @returns NextResponse with 403 status
 */
export function forbiddenResponse(message: string = "Forbidden"): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 403 }
  );
}

/**
 * Creates a created response
 * @param data - The created resource data
 * @param message - Optional success message
 * @returns NextResponse with 201 status
 */
export function createdResponse<T>(
  data: T,
  message: string = "Resource created successfully"
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status: 201 }
  );
}

/**
 * Creates a no content response
 * @returns NextResponse with 204 status
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}
