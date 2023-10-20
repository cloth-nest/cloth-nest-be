export type TypeError =
  | 'InternalServerError'
  | 'DatabaseError'
  | 'MailerError'
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
  typeError: TypeError | string;
};
