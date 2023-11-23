import { CustomError, TypeError } from '../types';

type Code =
  // Group A
  | 'InternalServerError'
  | 'TypeOrmError'
  | 'MailerError'
  | 'JsonWebTokenError'
  | 'InvalidRoute'
  | 'EmptyBody'
  | 'UnprocessableEntity'

  // Group B
  | 'InvalidEmail'
  | 'InvalidPassword'
  | 'InvalidFirstName'
  | 'InvalidLastName'
  | 'InvalidGender'
  | 'InvalidCode'
  | 'InvalidNewPassword'
  | 'InvalidOldPassword'
  | 'InvalidRefreshToken'
  | 'InvalidProvinceCode'
  | 'InvalidProvinceName'
  | 'InvalidDistrictCode'
  | 'InvalidDistrictName'
  | 'InvalidWardCode'
  | 'InvalidWardName'
  | 'InvalidAddressDetail'
  | 'InvalidPhone'
  | 'InvalidIsAddressProfile'
  | 'InvalidCategoryName'
  | 'InvalidCategoryDescription'
  | 'InvalidParentCategoryId'
  | 'InvalidLevelQueryParam'
  | 'InvalidDepthQueryParam'
  | 'InvalidPageQueryParam'
  | 'InvalidLimitQueryParam'
  | 'InvalidIdPathParam'
  | 'InvalidSearchQueryParam'
  | 'InvalidProductAttributeName'
  | 'InvalidAttributeId'
  | 'InvalidAttributeValue'

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
  | 'NewPasswordMatchOldPassword'

  // Group D
  | 'Unauthorized'
  | 'NotFound'
  | 'Forbidden'

  // Group E (Address)
  | 'AddressProfileExist'
  | 'UserAddressMustBeLessThanOrEqual10'
  | 'AddressNotExist'
  | 'CannotDeleteAddressProfile'
  | 'AddressIsDefaultAddress'

  // Group F (Category)
  | 'CategoryNotExist'
  | 'ParentCategoryNotExist'

  // Group G (Product)
  | 'ProductAttributeNotExist'
  | 'ProductAttributeNameExist'
  | 'ProductAttributeHasValuesCanNotDelete'
  | 'ProductAttributeValueExist';

export const TYPE_ERRORS: Record<TypeError, TypeError> = {
  InternalServerError: 'InternalServerError',
  DatabaseError: 'DatabaseError',
  MailerError: 'MailerError',
  JsonWebTokenError: 'JsonWebTokenError',
  InvalidRouteError: 'InvalidRouteError',
  ValidationError: 'ValidationError',
  ImageValidationError: 'ImageValidationError',
  EmailExistedError: 'EmailExistedError',
  TypeOrmError: 'TypeOrmError',
  InvalidLinkError: 'InvalidLinkError',
  AccountUnactiveError: 'AccountUnactiveError',
  AccountActivatedBeforeError: 'AccountActivatedBeforeError',
  EmailNotRegisterdError: 'EmailNotRegisterdError',
  WrongCodeError: 'WrongCodeError',
  CodeExpiredError: 'CodeExpiredError',
  WrongPasswordError: 'WrongPasswordError',
  WrongRefreshTokenError: 'WrongRefreshTokenError',
  SessionResetPasswordError: 'SessionResetPasswordError',
  NewPasswordMatchOldPasswordError: 'NewPasswordMatchOldPasswordError',
  ProductAttributeError: 'ProductAttributeError',
  UnauthorizedError: 'UnauthorizedError',
  NotFoundError: 'NotFoundError',
  ForbiddenError: 'ForbiddenError',
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
  EmptyBody: {
    code: 'A0006',
    message: 'The body cannot be empty',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  UnprocessableEntity: {
    code: 'A0007',
    message: 'Unprocessable entity',
    statusCode: 422,
    typeError: TYPE_ERRORS.ImageValidationError,
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
  InvalidProvinceCode: {
    code: 'B0009',
    message: 'Invalid input provinceCode',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidProvinceName: {
    code: 'B0010',
    message: 'Invalid input provinceName',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidDistrictCode: {
    code: 'B0011',
    message: 'Invalid input districtCode',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidDistrictName: {
    code: 'B0012',
    message: 'Invalid input districtName',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidWardCode: {
    code: 'B0013',
    message: 'Invalid input wardCode',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidWardName: {
    code: 'B0014',
    message: 'Invalid input wardName',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidAddressDetail: {
    code: 'B0015',
    message: 'Invalid input addressDetail',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidPhone: {
    code: 'B0016',
    message: 'Invalid input phone',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidIsAddressProfile: {
    code: 'B0017',
    message: 'Invalid input isAddressProfile',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidGender: {
    code: 'B0018',
    message: 'Gender is enum data type',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidLevelQueryParam: {
    code: 'B0019',
    message: 'Invalid input level query param',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidPageQueryParam: {
    code: 'B0020',
    message: 'Invalid input page query param',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidLimitQueryParam: {
    code: 'B0021',
    message: 'Invalid input limit query param',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidIdPathParam: {
    code: 'B0022',
    message: 'Invalid input id path param',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidCategoryName: {
    code: 'B0023',
    message: 'Invalid input categoryName',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidCategoryDescription: {
    code: 'B0024',
    message: 'Invalid input categoryDescription',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidParentCategoryId: {
    code: 'B0025',
    message: 'Invalid input parentCategoryId',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidDepthQueryParam: {
    code: 'B0026',
    message: 'Invalid input depth query param',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidSearchQueryParam: {
    code: 'B0027',
    message: 'Invalid input search query param',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidProductAttributeName: {
    code: 'B0028',
    message: 'Invalid input productAttributeName',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidAttributeId: {
    code: 'B0029',
    message: 'Invalid input attributeId',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidAttributeValue: {
    code: 'B0030',
    message: 'Invalid input attributeValue',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidRoute: {
    code: 'A0005',
    message: 'Invalid route',
    statusCode: 400,
    typeError: TYPE_ERRORS.InvalidRouteError,
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
  NewPasswordMatchOldPassword: {
    code: 'C0011',
    message: 'The new password must not be the same as the old password',
    statusCode: 409,
    typeError: TYPE_ERRORS.NewPasswordMatchOldPasswordError,
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
  Forbidden: {
    code: 'D0003',
    message: 'Forbidden',
    statusCode: 403,
    typeError: TYPE_ERRORS.ForbiddenError,
  },

  // Group E
  AddressProfileExist: {
    code: 'E0001',
    message: 'Address profile is already existed',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  UserAddressMustBeLessThanOrEqual10: {
    code: 'E0002',
    message: 'User address must be less than or equal 10',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  AddressNotExist: {
    code: 'E0003',
    message: 'Address not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.NotFoundError,
  },
  CannotDeleteAddressProfile: {
    code: 'E0004',
    message: 'Cannot delete address profile',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  AddressIsDefaultAddress: {
    code: 'E0005',
    message: 'Address is default address',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },

  // Group F
  CategoryNotExist: {
    code: 'F0001',
    message: 'Category not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.NotFoundError,
  },
  ParentCategoryNotExist: {
    code: 'F0002',
    message: 'Parent category not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.NotFoundError,
  },

  // Group G
  ProductAttributeNotExist: {
    code: 'G0001',
    message: 'Product attribute not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.ProductAttributeError,
  },
  ProductAttributeNameExist: {
    code: 'G0002',
    message: 'Product attribute name is already existed',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductAttributeError,
  },
  ProductAttributeHasValuesCanNotDelete: {
    code: 'G0003',
    message: 'Product attribute has values can not delete',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductAttributeError,
  },
  ProductAttributeValueExist: {
    code: 'G0004',
    message: 'Product attribute value is already existed',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductAttributeError,
  },
};
