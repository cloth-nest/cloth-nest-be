import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exceptions/validator.exception';
import { ERRORS } from '../constants';
import { CustomErrorException } from '../exceptions/custom-error.exception';
import { AppResponse, CustomError } from '../types';
import { TypeORMError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Override for custom error handling
   *
   * @param exception
   * @param host
   */
  catch(
    exception: HttpException | ValidationException | TypeORMError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { code, message, statusCode, typeError } =
      this.formatError(exception);
    const errorResponse: AppResponse<Pick<CustomError, 'code' | 'message'>> = {
      statusCode,
      message: typeError,
      error: {
        code,
        message,
      },
    };

    Logger.error(exception.stack, exception.name);

    response.status(statusCode).send(errorResponse);
  }

  /**
   * Get error code from exception
   *
   * @protected
   */
  protected formatError(
    e: CustomErrorException | ValidationException | TypeORMError,
  ): CustomError {
    if (e instanceof TypeORMError) {
      const errorResponse = ERRORS.TypeOrmError;
      return {
        ...errorResponse,
        message: e.message,
        typeError: e.name,
      };
    }
    if (e instanceof CustomErrorException) {
      return e.getResponse();
    }
    let field = '';
    if (e instanceof ValidationException) {
      field = e.getResponse()['error'] ?? '';
    }
    switch (field) {
      case 'email': {
        return ERRORS.InvalidEmail;
      }
      case 'password': {
        return ERRORS.InvalidPassword;
      }
      case 'lastName': {
        return ERRORS.InvalidLastName;
      }
      case 'firstName': {
        return ERRORS.InvalidFirstName;
      }
      case 'code': {
        return ERRORS.InvalidCode;
      }
      case 'newPassword': {
        return ERRORS.InvalidNewPassword;
      }
      case 'oldPassword': {
        return ERRORS.InvalidOldPassword;
      }
      default:
        return ERRORS.InternalServerError;
    }
  }
}
