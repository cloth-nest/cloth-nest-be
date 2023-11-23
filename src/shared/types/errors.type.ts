export type TypeError =
  | 'InternalServerError'
  | 'DatabaseError'
  | 'MailerError'
  | 'JsonWebTokenError'
  | 'InvalidRouteError'
  | 'ValidationError'
  | 'ImageValidationError'
  | 'EmailExistedError'
  | 'TypeOrmError'
  | 'InvalidLinkError'
  | 'AccountUnactiveError'
  | 'AccountActivatedBeforeError'
  | 'EmailNotRegisterdError'
  | 'WrongCodeError'
  | 'CodeExpiredError'
  | 'WrongPasswordError'
  | 'WrongRefreshTokenError'
  | 'SessionResetPasswordError'
  | 'NewPasswordMatchOldPasswordError'
  | 'ProductAttributeError'
  | 'UnauthorizedError'
  | 'NotFoundError'
  | 'ForbiddenError';

export type MessageValidationError = {
  message: string;
  field: string;
};

export type CustomError = {
  code: string;
  message: string;
  statusCode: number;
  detail?: string;
  typeError: TypeError | string;
};
