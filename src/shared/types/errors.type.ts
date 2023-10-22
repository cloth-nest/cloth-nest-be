export type TypeError =
  | 'InternalServerError'
  | 'DatabaseError'
  | 'MailerError'
  | 'JsonWebTokenError'
  | 'ValidationError'
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
  | 'UnauthorizedError'
  | 'NotFoundError';

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
