import { CustomError, TypeError } from '../types';

type Code =
  // Group A
  | 'InternalServerError'
  | 'TypeOrmError'
  | 'MailerError'
  | 'DBInsert'
  | 'DBUpdate'
  | 'DBQuery'
  | 'DBDelete'

  // Group B
  | 'InvalidEmail'
  | 'InvalidPassword'
  | 'InvalidFirstName'
  | 'InvalidLastName'
  | 'InvalidNewPassword'
  | 'InvalidOldPassword'

  // Group C
  | 'EmailExisted'
  | 'InvalidLink'
  | 'AccountUnactive'
  | 'Unauthorized'
  | 'NotFound'
  | 'EmailNotRegisterd';

export const TYPE_ERRORS: Record<TypeError, TypeError> = {
  InternalServerError: 'InternalServerError',
  DatabaseError: 'DatabaseError',
  ValidationError: 'ValidationError',
  EmailExisted: 'EmailExisted',
  TypeOrmError: 'TypeOrmError',
  MailerError: 'MailerError',
};

export const ERRORS: Record<Code, CustomError> = {
  // Group A
  InternalServerError: {
    code: 'A0001',
    message: 'Internal server error',
    statusCode: 500,
    typeError: TYPE_ERRORS.InternalServerError,
  },
  TypeOrmError: {
    code: 'A0002',
    message: 'TypeOrmError something ..., need to override message field',
    statusCode: 500,
    typeError: TYPE_ERRORS.TypeOrmError, // Maybe this field also override
  },
  MailerError: {
    code: 'A0003',
    message: 'MailerError something ..., need to override message field',
    statusCode: 500,
    typeError: TYPE_ERRORS.MailerError,
  },
  DBInsert: {
    code: 'A0002',
    message: 'Cannot insert data to database',
    statusCode: 500,
    typeError: TYPE_ERRORS.DatabaseError,
  },
  DBUpdate: {
    code: 'A0003',
    message: 'Cannot update data to database',
    statusCode: 500,
    typeError: TYPE_ERRORS.DatabaseError,
  },
  DBQuery: {
    code: 'A0004',
    message: 'Cannot query data in databsase',
    statusCode: 500,
    typeError: TYPE_ERRORS.DatabaseError,
  },
  DBDelete: {
    code: 'A0005',
    message: 'Cannot delete data in database',
    statusCode: 500,
    typeError: TYPE_ERRORS.DatabaseError,
  },

  // Group B
  InvalidEmail: {
    code: 'B0001',
    message: 'Invalid input email',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidPassword: {
    code: 'B0002',
    message: 'Invalid input password',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidFirstName: {
    code: 'B0003',
    message: 'Invalid input firstName',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidLastName: {
    code: 'B0004',
    message: 'Invalid input lastName',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidNewPassword: {
    code: 'B0005',
    message: 'Invalid input newPassword',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidOldPassword: {
    code: 'B0006',
    message: 'Invalid input oldPassword',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },

  // Group C
  EmailExisted: {
    code: 'C0001',
    message: 'Email is already existed',
    statusCode: 409,
    typeError: TYPE_ERRORS.EmailExisted,
  },
  InvalidLink: {
    code: 'C0002',
    message: 'Invalid link',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  AccountUnactive: {
    code: 'C0003',
    message: 'An Email sent to your account please verify',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  Unauthorized: {
    code: 'C0004',
    message: 'Unauthorized',
    statusCode: 401,
    typeError: TYPE_ERRORS.ValidationError,
  },
  NotFound: {
    code: 'C0005',
    message: 'NotFound',
    statusCode: 404,
    typeError: TYPE_ERRORS.ValidationError,
  },
  EmailNotRegisterd: {
    code: 'C0006',
    message: 'Email is not registered',
    statusCode: 404,
    typeError: TYPE_ERRORS.ValidationError,
  },
};
