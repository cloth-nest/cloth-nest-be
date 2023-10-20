import { ValidationError } from 'class-validator';
import { MessageValidationError } from '../types';

export const getMessage = (
  errors: ValidationError[],
): MessageValidationError => {
  const error = getDeepError(errors[0]);
  const field = error.property;
  const message = Object.values(error.constraints)[0] ?? '';

  return {
    message: message,
    field: field,
  };
};

/**
 * Use recursion to get validation error information when an error occurs
 *
 * @param error
 */
export const getDeepError = (error: ValidationError): ValidationError => {
  if (!error.children.length) {
    return error;
  } else {
    return getDeepError(error.children[0]);
  }
};
