import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(message: string, description: string) {
    super(message, description);
  }
}
