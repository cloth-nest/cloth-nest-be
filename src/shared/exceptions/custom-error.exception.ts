import { CustomError, TypeError } from '../types';
import { HttpException } from '@nestjs/common';

export class CustomErrorException extends HttpException {
  readonly code: string;
  readonly statusCode: number;
  readonly message: string;
  readonly typeError: TypeError | string;
  constructor(error: CustomError) {
    super(error.message, error.statusCode, {
      description: error.code,
    });
    this.code = error.code;
    this.statusCode = error.statusCode;
    this.message = error.message;
    this.typeError = error.typeError;
  }

  /**
   * Override and return exactly statusCode
   */
  public getStatus(): number {
    return this.statusCode;
  }

  /**
   * Get response error
   */
  public getResponse(): CustomError {
    super.getResponse();
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      typeError: this.typeError,
    };
  }
}
