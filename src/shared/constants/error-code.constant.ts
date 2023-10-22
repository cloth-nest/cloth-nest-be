import { CustomError, TypeError } from '../types';

type Code =
  // Group A
  | 'InternalServerError'
  | 'TypeOrmError'
  | 'MailerError'
  | 'JsonWebTokenError'

  // Group B
  | 'InvalidEmail'
  | 'InvalidPassword'
  | 'InvalidFirstName'
  | 'InvalidLastName'
  | 'InvalidCode'
  | 'InvalidNewPassword'
  | 'InvalidOldPassword'
  | 'InvalidRefreshToken'

  // Group C
  | 'EmailExisted'
  | 'InvalidLink'
  | 'AccountUnactive'
  | 'AccountActivatedBefore'
  | 'EmailNotRegisterd'
  | 'WrongCode'
  | 'CodeExpired'
  | 'WrongPassword'
  | 'WrongRefreshToken'
  | 'SessionResetPassword'

  // Group D
  | 'Unauthorized'
  | 'NotFound';

export const TYPE_ERRORS: Record<TypeError, TypeError> = {
  InternalServerError: 'InternalServerError',
  DatabaseError: 'DatabaseError',
  MailerError: 'MailerError',
  JsonWebTokenError: 'JsonWebTokenError',
  ValidationError: 'ValidationError',
  EmailExistedError: 'EmailExistedError',
  TypeOrmError: 'TypeOrmError',
  InvalidLinkError: 'InvalidLinkError',
  AccountUnactiveError: 'AccountUnactiveError',
  AccountActivatedBeforeError: 'AccountActivatedBeforeError',
  EmailNotRegisterdError: 'EmailNotRegisterdError',
  WrongCodeError: 'WrongCodeError',
  CodeExpiredError: 'CodeExpiredError',
  UnauthorizedError: 'UnauthorizedError',
  NotFoundError: 'NotFoundError',
  WrongPasswordError: 'WrongPasswordError',
  WrongRefreshTokenError: 'WrongRefreshTokenError',
  SessionResetPasswordError: 'SessionResetPasswordError',
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
  JsonWebTokenError: {
    code: 'A0004',
    message: 'Invalid token',
    statusCode: 400,
    typeError: TYPE_ERRORS.JsonWebTokenError,
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
  InvalidCode: {
    code: 'B0005',
    message: 'Invalid input code',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidNewPassword: {
    code: 'B0006',
    message: 'Invalid input newPassword',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidOldPassword: {
    code: 'B0007',
    message: 'Invalid input oldPassword',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidRefreshToken: {
    code: 'B0008',
    message: 'Invalid input refreshToken',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },

  // Group C
  EmailExisted: {
    code: 'C0001',
    message: 'Email is already existed',
    statusCode: 409,
    typeError: TYPE_ERRORS.EmailExistedError,
  },
  InvalidLink: {
    code: 'C0002',
    message: 'Invalid link',
    statusCode: 409,
    typeError: TYPE_ERRORS.InvalidLinkError,
  },
  AccountUnactive: {
    code: 'C0003',
    message: 'An Email sent to your account please verify',
    statusCode: 400,
    typeError: TYPE_ERRORS.AccountUnactiveError,
  },
  AccountActivatedBefore: {
    code: 'C0004',
    message: 'The account has been activated previously.',
    statusCode: 409,
    typeError: TYPE_ERRORS.AccountActivatedBeforeError,
  },
  WrongCode: {
    code: 'C0005',
    message: 'Wrong code',
    statusCode: 409,
    typeError: TYPE_ERRORS.WrongCodeError,
  },
  CodeExpired: {
    code: 'C0006',
    message: 'Code has expired, please resend new code',
    statusCode: 409,
    typeError: TYPE_ERRORS.CodeExpiredError,
  },
  EmailNotRegisterd: {
    code: 'C0007',
    message: 'Email is not registered',
    statusCode: 404,
    typeError: TYPE_ERRORS.EmailNotRegisterdError,
  },
  WrongPassword: {
    code: 'C0008',
    message: 'Password is not correct',
    statusCode: 400,
    typeError: TYPE_ERRORS.WrongPasswordError,
  },
  WrongRefreshToken: {
    code: 'C0009',
    message: 'Refresh token not match with user',
    statusCode: 401,
    typeError: TYPE_ERRORS.UnauthorizedError,
  },
  SessionResetPassword: {
    code: 'C0010',
    message: 'Invalid session reset password',
    statusCode: 400,
    typeError: TYPE_ERRORS.SessionResetPasswordError,
  },

  // Group D
  Unauthorized: {
    code: 'D0001',
    message: 'Unauthorized',
    statusCode: 401,
    typeError: TYPE_ERRORS.UnauthorizedError,
  },
  NotFound: {
    code: 'D0002',
    message: 'NotFound',
    statusCode: 404,
    typeError: TYPE_ERRORS.NotFoundError,
  },
};
