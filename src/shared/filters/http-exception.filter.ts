import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exceptions/validator.exception';
import { ERRORS } from '../constants';
import { CustomErrorException } from '../exceptions/custom-error.exception';
import { AppResponse, CustomError } from '../types';
import { TypeORMError } from 'typeorm';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Override for custom error handling
   *
   * @param exception
   * @param host
   */
  catch(
    exception:
      | HttpException
      | ValidationException
      | TypeORMError
      | UnprocessableEntityException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { code, message, statusCode, typeError } =
      this.formatError(exception);
    const errorResponse: AppResponse<
      Pick<CustomError, 'code' | 'message' | 'detail'>
    > = {
      statusCode,
      message: typeError,
      error: {
        code,
        message,
        detail:
          exception.name === 'ValidationException' ||
          exception.name === 'JsonWebTokenError' ||
          exception.name === 'UnprocessableEntityException'
            ? exception.message
            : undefined,
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
    if (e instanceof JsonWebTokenError) {
      return ERRORS.JsonWebTokenError;
    }
    if (e instanceof NotFoundException) {
      return ERRORS.InvalidRoute;
    }
    if (e instanceof ForbiddenException) {
      return ERRORS.Forbidden;
    }
    if (e instanceof UnprocessableEntityException) {
      return ERRORS.UnprocessableEntity;
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
      case 'gender': {
        return ERRORS.InvalidGender;
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
      case 'refreshToken': {
        return ERRORS.InvalidRefreshToken;
      }
      case 'provinceCode': {
        return ERRORS.InvalidProvinceCode;
      }
      case 'provinceName': {
        return ERRORS.InvalidProvinceName;
      }
      case 'districtCode': {
        return ERRORS.InvalidDistrictCode;
      }
      case 'districtName': {
        return ERRORS.InvalidDistrictName;
      }
      case 'wardCode': {
        return ERRORS.InvalidWardCode;
      }
      case 'wardName': {
        return ERRORS.InvalidWardName;
      }
      case 'detail': {
        return ERRORS.InvalidAddressDetail;
      }
      case 'phone': {
        return ERRORS.InvalidPhone;
      }
      case 'isAddressProfile': {
        return ERRORS.InvalidIsAddressProfile;
      }
      case 'level': {
        return ERRORS.InvalidLevelQueryParam;
      }
      case 'depth': {
        return ERRORS.InvalidDepthQueryParam;
      }
      case 'page': {
        return ERRORS.InvalidPageQueryParam;
      }
      case 'limit': {
        return ERRORS.InvalidLimitQueryParam;
      }
      case 'id': {
        return ERRORS.InvalidIdPathParam;
      }
      case 'name': {
        return ERRORS.InvalidCategoryName;
      }
      case 'description': {
        return ERRORS.InvalidCategoryDescription;
      }
      case 'parentId': {
        return ERRORS.InvalidParentCategoryId;
      }
      case 'search': {
        return ERRORS.InvalidSearchQueryParam;
      }
      case 'productAttributeName': {
        return ERRORS.InvalidProductAttributeName;
      }
      case 'attributeId': {
        return ERRORS.InvalidAttributeId;
      }
      case 'attributeValue': {
        return ERRORS.InvalidAttributeValue;
      }
      case 'productTypeName': {
        return ERRORS.InvalidProductTypeName;
      }
      case 'requireNotEmpty': {
        return ERRORS.EmptyBody;
      }
      case 'permissionName': {
        return ERRORS.InvalidPermissionName;
      }
      case 'permissionCode': {
        return ERRORS.InvalidPermissionCode;
      }
      case 'permissionIds': {
        return ERRORS.InvalidPermissionIds;
      }
      case 'groupPermissionName': {
        return ERRORS.InvalidGroupPermissionName;
      }
      default:
        return ERRORS.InternalServerError;
    }
  }
}
