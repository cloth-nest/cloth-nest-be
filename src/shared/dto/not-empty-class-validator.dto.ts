import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsNotEmptyIfAllFieldsAreEmptyConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const dto = args.object;
    return Object.values(dto).some(
      (field) => field !== undefined && field !== null && field !== '',
    );
  }

  defaultMessage() {
    return 'At least one field must be filled in.';
  }
}
