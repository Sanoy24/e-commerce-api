import { BaseResponseDto } from '../dtos/base-response.dto';
import { PaginatedResponseDto } from '../dtos/paginated-response.dto';

/**
 * Creates a standardized base response.
 * @param message - Human-readable message
 * @param object - The main response payload
 * @param errors - Optional list of error messages
 */
export function createResponse<T>(
  message: string,
  object: T,
  errors: string[] | null = null,
): BaseResponseDto<T> {
  const success = errors === null;
  return new BaseResponseDto(success, message, object, errors);
}

/**
 * Creates a standardized paginated response.
 * @param message - Human-readable message
 * @param object - List of returned items
 * @param pageNumber - Current page number
 * @param pageSize - Items per page
 * @param totalSize - Total number of items
 * @param errors - Optional list of errors
 */
export function createPaginatedResponse<T>(
  message: string,
  object: T[],
  pageNumber: number,
  pageSize: number,
  totalSize: number,
  errors: string[] | null = null,
): PaginatedResponseDto<T> {
  const success = errors === null;
  return new PaginatedResponseDto(
    success,
    message,
    object,
    pageNumber,
    pageSize,
    totalSize,
    errors,
  );
}
