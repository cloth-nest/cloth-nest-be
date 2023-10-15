export type AppResponse<DataOrError> = {
  statusCode: number;
  message?: string;
  data?: DataOrError;
  error?: DataOrError;
};
