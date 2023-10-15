import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationException } from '../exceptions/validator.exception';
import { MessageValidationError } from '../types';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const { message, field } = this.getMessage(errors);
      throw new ValidationException(message, field);
    }
    return value;
  }

  /**
   * To validate
   *
   * @param metatype
   * @private
   */
  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  /**
   * Get field and message for validate exception
   *
   * @private
   */
  private getMessage(errors: ValidationError[]): MessageValidationError {
    const error = this.getDeepError(errors[0]);
    const field = error.property;
    const message = Object.values(error.constraints)[0] ?? '';

    return {
      message: message,
      field: field,
    };
  }

  /**
   * Use recursion to get validation error information when an error occurs
   *
   * @param error
   */
  getDeepError(error: ValidationError): ValidationError {
    if (!error.children.length) {
      return error;
    } else {
      return this.getDeepError(error.children[0]);
    }
  }
}
