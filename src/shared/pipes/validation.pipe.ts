import {
  ArgumentMetadata,
  Injectable,
  Paramtype,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationException } from '../exceptions/validator.exception';
import { getMessage } from '../utils';
import * as _ from 'lodash';
@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(
    value: any,
    { metatype, type }: ArgumentMetadata,
  ): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    // Parse value before validate
    this.parseValue(object, type);
    const errors = await validate(object);

    if (errors.length > 0) {
      const { message, field } = getMessage(errors);
      throw new ValidationException(message, field);
    }
    return object;
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

  private parseValue(object: any, type: Paramtype) {
    switch (type) {
      case 'query':
        _.mapValues(object, (value, key) => {
          switch (key) {
            case 'level':
            case 'page':
            case 'limit':
              object[key] = parseInt(value);
              break;
            default:
              break;
          }
        });
        break;
      default:
        break;
    }
  }
}
