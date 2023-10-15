export type TypeError =
  | 'InternalServerError'
  | 'DatabaseError'
  | 'MailerError'
  | 'ValidationError'
  | 'EmailExisted'
  | 'TypeOrmError';

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
