import { ApiRequest, ApiResponse, ApiNextFunction, StatusCode } from '..';
import { sendErrorResponse, sendServerError } from '../util';
import { ErrorCode } from '../../core';


/**
 * middleware to handle api errors
 */
export const errorHandler = () =>
  (err: any, req: ApiRequest, res: ApiResponse, next: ApiNextFunction) => {
    console.log('Error:', err);
    switch (err.code) {
      case ErrorCode.ACCOUNT_NOT_FOUND:
        return sendErrorResponse(
          res,
          StatusCode.UNPROCESSABLE_ENTITY,
          err.message
        );
      case ErrorCode.VALIDATION_ERROR:
        return sendErrorResponse(
          res,
          StatusCode.UNPROCESSABLE_ENTITY,
          err.message
        );
      case ErrorCode.LOGIN_FAILED:
        return sendErrorResponse(res, StatusCode.UNAUTHORIZED, err.message);
      case ErrorCode.INVALID_ACCESS_TOKEN:
        return sendErrorResponse(res, StatusCode.UNAUTHORIZED, err.message);
      case ErrorCode.MISSING_AUTHENTICATION:
        return sendErrorResponse(res, StatusCode.UNAUTHORIZED, err.message);
      case ErrorCode.PERMISSION_DENIED:
        return sendErrorResponse(res, StatusCode.FORBIDDEN, err.message);
      case ErrorCode.DB_OBJECT_NOT_FOUND:
        return sendErrorResponse(res, StatusCode.NOT_FOUND, err.message);
      case ErrorCode.AGGREGATION_FAILED:
        return sendErrorResponse(res, StatusCode.BAD_REQUEST, err.message);
      default:
        if (err instanceof SyntaxError) {
          return sendErrorResponse(
            res,
            StatusCode.BAD_REQUEST,
            `Invalid syntax in request body: ${err.message}`
          );
        }
        sendServerError(res);
    }
  };
