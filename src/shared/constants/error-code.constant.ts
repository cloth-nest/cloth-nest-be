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
  | 'GHNThirdPartyError'
  | 'RecomendationSystemError'

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
  | 'InvalidProductTypeName'
  | 'InvalidPermissionName'
  | 'InvalidPermissionCode'
  | 'InvalidGroupPermissionName'
  | 'InvalidPermissionIds'
  | 'InvalidGroupPermissionIds'
  | 'InvalidIsActive'
  | 'InvalidVariantsIds'
  | 'InvalidAddressId'
  | 'InvalidPaymentMethod'
  | 'InvalidGhnServerTypeId'
  | 'InvalidProductTypeId'
  | 'InvalidAttributeType'
  | 'InvalidProductAttributeIds'
  | 'InvalidCategoryId'
  | 'InvalidProductName'
  | 'InvalidProductDescription'
  | 'InvalidOrderStatus'
  | 'InvalidCountQueryParam'
  | 'InvalidReviewContent'
  | 'InvalidRating'

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
  | 'StaffMemberNotFound'
  | 'CannotChangeSuperUserStatus'
  | 'CannotChangeCurrentUserStatus'

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
  | 'CategoryHasSubCategory'
  | 'CategoryHasProduct'

  // Group G (Product)
  | 'ProductAttributeNotExist'
  | 'ProductAttributeNameExist'
  | 'ProductAttributeHasValuesCanNotDelete'
  | 'ProductAttributeValueExist'
  | 'ProductAttributeValueNotExist'
  | 'ProductTypeNotExist'
  | 'ProductTypeAlreadyExist'
  | 'ColorNotExist'
  | 'SizeNotExist'
  | 'ProductNotExist'
  | 'ProductVariantNotExist'
  | 'ProductTypeProductAttributeAlreadyExist'
  | 'ProductTypeVariantAttributeAlreadyExist'
  | 'AttributeExistInVariantAttribute'
  | 'AttributeExistInProductAttribute'
  | 'ProductAttributeNotExistInProductType'
  | 'ProductAttributeAssignedExist'
  | 'VariantAttributeNotExistInProductType'
  | 'VariantAttributeAssignedExist'
  | 'ProductTypeHasProduct'
  | 'ProductTypeHasProductAttribute'
  | 'ProductAttributeNotBelongToType'
  | 'ProductAttributeValueNotBelongToAttribute'
  | 'ImageNotExist'
  | 'ImageBelongToVariant'
  | 'MinimumImageUploadIsOne'
  | 'ProductHasNoVariant'
  | 'ProductSkuExist'
  | 'WarehouseNotExist'
  | 'ProductVariantAttributesEmpty'

  // Group H (Permission)
  | 'PermissionAlreadyExist'
  | 'PermissionNotExist'
  | 'PermissionNameOrCodeExist'
  | 'PermissionIsUsing'
  | 'GroupPermissionAlreadyExist'
  | 'GroupPermissionNotExist'
  | 'GroupPermissionIsUsing'

  // Group I (Wishlist)
  | 'DuplicateProductVariantIds'
  | 'ProductVariantAlreadyExist'
  | 'WishlistItemLimit'

  // Group J (Cart)
  | 'CartItemNotExist'
  | 'QuantityGreaterThanCart'

  // Group K (Order)
  | 'OrderNotExist'
  | 'InventoryNotEnough'
  | 'CartEmpty'
  | 'CartStageInvalid'
  | 'BillInfoNotExist'
  | 'OrderPhoneNotExist'
  | 'PaymentMethodNotExist'
  | 'DeliveryMethodNotExist'
  | 'OrderAlreadyPaid'
  | 'OrderAlreadyCanceled'
  | 'OrderAlreadyDelivered'
  | 'OrderAlreadyUpdated'
  | 'UserNotExist'
  | 'MissFieldQuantity'

  // Group L (Payment)
  | 'ZaloPayPaymentFailed'

  // Group M (Statistic)
  | 'StartDateEndDateRequired'
  | 'StartDateMustBeBeforeEndDate'

  // Group N (Warehouse)
  | 'WarehouseNameExist'
  | 'WarehouseNotFound'
  | 'WarehouseHasStock'

  // Group O (Review)
  | 'ReviewNotExist';

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
  ProductTypeError: 'ProductTypeError',
  ProductVariantError: 'ProductVariantError',
  PermissionError: 'PermissionError',
  WishlistError: 'WishlistError',
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
  GHNThirdPartyError: {
    code: 'A0008',
    message: 'GHN third party error',
    statusCode: 500,
    typeError: TYPE_ERRORS.InternalServerError,
  },
  RecomendationSystemError: {
    code: 'A0009',
    message: 'Reccomendation system error',
    statusCode: 500,
    typeError: TYPE_ERRORS.InternalServerError,
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
  InvalidProductTypeName: {
    code: 'B0031',
    message: 'Invalid input productTypeName',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidPermissionName: {
    code: 'B0032',
    message: 'Invalid input permissionName',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidPermissionCode: {
    code: 'B0033',
    message: 'Invalid input permissionCode',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidGroupPermissionName: {
    code: 'B0034',
    message: 'Invalid input groupPermissionName',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidPermissionIds: {
    code: 'B0035',
    message: 'Invalid input permissionIds',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidGroupPermissionIds: {
    code: 'B0036',
    message: 'Invalid input groupPermissionIds',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidIsActive: {
    code: 'B0037',
    message: 'Invalid input isActive',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidAddressId: {
    code: 'B0038',
    message: 'Invalid input addressId',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidPaymentMethod: {
    code: 'B0039',
    message: 'Invalid input paymentMethod',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidGhnServerTypeId: {
    code: 'B0040',
    message: 'Invalid input ghnServerTypeId',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidRoute: {
    code: 'A0005',
    message: 'Invalid route',
    statusCode: 400,
    typeError: TYPE_ERRORS.InvalidRouteError,
  },
  InvalidProductTypeId: {
    code: 'B0041',
    message: 'Invalid input productTypeId',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidAttributeType: {
    code: 'B0042',
    message: 'Invalid input attributeType',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidProductAttributeIds: {
    code: 'B0043',
    message: 'Invalid input productAttributeIds',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidCategoryId: {
    code: 'B0044',
    message: 'Invalid input categoryId',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidProductName: {
    code: 'B0045',
    message: 'Invalid input productName',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidProductDescription: {
    code: 'B0046',
    message: 'Invalid input productDescription',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidOrderStatus: {
    code: 'B0047',
    message: 'Invalid input orderStatus',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidCountQueryParam: {
    code: 'B0048',
    message: 'Invalid input count query param',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidReviewContent: {
    code: 'B0049',
    message: 'Invalid input reviewContent',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidRating: {
    code: 'B0050',
    message: 'Invalid input rating',
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
  NewPasswordMatchOldPassword: {
    code: 'C0011',
    message: 'The new password must not be the same as the old password',
    statusCode: 409,
    typeError: TYPE_ERRORS.NewPasswordMatchOldPasswordError,
  },
  StaffMemberNotFound: {
    code: 'C0012',
    message: 'Staff member not found',
    statusCode: 404,
    typeError: TYPE_ERRORS.NotFoundError,
  },
  CannotChangeSuperUserStatus: {
    code: 'C0013',
    message: 'Cannot change super user status',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  CannotChangeCurrentUserStatus: {
    code: 'C0014',
    message: 'Cannot change current user status',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  InvalidVariantsIds: {
    code: 'C0015',
    message: 'Invalid input variantsIds',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
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
  CategoryHasSubCategory: {
    code: 'F0003',
    message: 'Category has sub category',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  CategoryHasProduct: {
    code: 'F0004',
    message: 'Category has product',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },

  // Group G (Product)
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
  ProductAttributeValueNotExist: {
    code: 'G0005',
    message: 'Product attribute value not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.ProductAttributeError,
  },
  ProductTypeNotExist: {
    code: 'G0006',
    message: 'Product type not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  ProductTypeAlreadyExist: {
    code: 'G0007',
    message: 'Product type is already existed',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  ColorNotExist: {
    code: 'G0008',
    message: 'Color not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  SizeNotExist: {
    code: 'G0009',
    message: 'Size not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  ProductNotExist: {
    code: 'G0010',
    message: 'Product not existed',
    statusCode: 404,
    typeError: TYPE_ERRORS.NotFoundError,
  },
  ProductVariantNotExist: {
    code: 'G0011',
    message: 'Product variant not existed',
    statusCode: 404,
    typeError: TYPE_ERRORS.ProductVariantError,
  },
  ProductTypeProductAttributeAlreadyExist: {
    code: 'G0012',
    message: 'Product type attribute already existed',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  ProductTypeVariantAttributeAlreadyExist: {
    code: 'G0013',
    message: 'Product type variant attribute already existed',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  AttributeExistInVariantAttribute: {
    code: 'G0014',
    message: 'Attribute exist in variant attribute',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  AttributeExistInProductAttribute: {
    code: 'G0015',
    message: 'Attribute exist in product attribute',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  ProductAttributeNotExistInProductType: {
    code: 'G0016',
    message: 'Product attribute not exist in product type',
    statusCode: 404,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  ProductAttributeAssignedExist: {
    code: 'G0017',
    message: 'Product attribute assigned exist',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  VariantAttributeNotExistInProductType: {
    code: 'G0018',
    message: 'Variant attribute not exist in product type',
    statusCode: 404,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  VariantAttributeAssignedExist: {
    code: 'G0019',
    message: 'Variant attribute assigned exist',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  ProductTypeHasProduct: {
    code: 'G0020',
    message: 'Product type has product',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  ProductTypeHasProductAttribute: {
    code: 'G0021',
    message: 'Product type has product attribute',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  ProductAttributeNotBelongToType: {
    code: 'G0022',
    message: 'Product attribute not belong to type',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  ProductAttributeValueNotBelongToAttribute: {
    code: 'G0023',
    message: 'Product attribute value not belong to attribute',
    statusCode: 409,
    typeError: TYPE_ERRORS.ProductTypeError,
  },
  ImageNotExist: {
    code: 'G0024',
    message: 'Image not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.NotFoundError,
  },
  ImageBelongToVariant: {
    code: 'G0025',
    message: 'Image belong to variant',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  MinimumImageUploadIsOne: {
    code: 'G0026',
    message: 'Minimum image upload is one',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  ProductHasNoVariant: {
    code: 'G0027',
    message: 'Product has no variant',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  ProductSkuExist: {
    code: 'G0028',
    message: 'Product sku is already existed',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  WarehouseNotExist: {
    code: 'G0029',
    message: 'Warehouse not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.ValidationError,
  },
  ProductVariantAttributesEmpty: {
    code: 'G0030',
    message: 'Product variant attributes is empty',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },

  // Group H (Permission)
  PermissionAlreadyExist: {
    code: 'H0001',
    message: 'Permission already existed',
    statusCode: 409,
    typeError: TYPE_ERRORS.PermissionError,
  },
  PermissionNotExist: {
    code: 'H0002',
    message: 'Permission not existed',
    statusCode: 404,
    typeError: TYPE_ERRORS.PermissionError,
  },
  PermissionNameOrCodeExist: {
    code: 'H0003',
    message: 'Permission name or code is already existed',
    statusCode: 409,
    typeError: TYPE_ERRORS.PermissionError,
  },
  PermissionIsUsing: {
    code: 'H0004',
    message: 'Permission is using',
    statusCode: 409,
    typeError: TYPE_ERRORS.PermissionError,
  },
  GroupPermissionAlreadyExist: {
    code: 'H0005',
    message: 'Group permission already existed',
    statusCode: 409,
    typeError: TYPE_ERRORS.PermissionError,
  },
  GroupPermissionNotExist: {
    code: 'H0006',
    message: 'Group permission not existed',
    statusCode: 404,
    typeError: TYPE_ERRORS.PermissionError,
  },
  GroupPermissionIsUsing: {
    code: 'H0007',
    message: 'Group permission is using',
    statusCode: 409,
    typeError: TYPE_ERRORS.PermissionError,
  },

  // Group I (Wishlist)
  DuplicateProductVariantIds: {
    code: 'I0001',
    message: 'Duplicate productVariantIds',
    statusCode: 409,
    typeError: TYPE_ERRORS.WishlistError,
  },
  ProductVariantAlreadyExist: {
    code: 'I0002',
    message: 'Product variant already exist',
    statusCode: 409,
    typeError: TYPE_ERRORS.WishlistError,
  },
  WishlistItemLimit: {
    code: 'I0003',
    message: 'Wishlist item limit is 10',
    statusCode: 409,
    typeError: TYPE_ERRORS.WishlistError,
  },

  // Group J (Cart)
  CartItemNotExist: {
    code: 'J0001',
    message: 'Cart item not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.NotFoundError,
  },
  QuantityGreaterThanCart: {
    code: 'J0002',
    message: 'Quantity is greater than quantity in cart',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },

  // Group K (Order)
  OrderNotExist: {
    code: 'K0001',
    message: 'Order not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.NotFoundError,
  },
  InventoryNotEnough: {
    code: 'K0002',
    message: 'Inventory not enough',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  CartEmpty: {
    code: 'K0003',
    message: 'Cart empty',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  CartStageInvalid: {
    code: 'K0004',
    message: 'Cart stage invalid',
    statusCode: 500,
    typeError: TYPE_ERRORS.InternalServerError,
  },
  BillInfoNotExist: {
    code: 'K0005',
    message: 'Bill info not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.InternalServerError,
  },
  OrderPhoneNotExist: {
    code: 'K0006',
    message: 'Order phone not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.ValidationError,
  },
  PaymentMethodNotExist: {
    code: 'K0007',
    message: 'Payment method not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.ValidationError,
  },
  DeliveryMethodNotExist: {
    code: 'K0008',
    message: 'Delivery method not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.ValidationError,
  },
  OrderAlreadyPaid: {
    code: 'K0009',
    message: 'Order already paid',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  OrderAlreadyCanceled: {
    code: 'K0010',
    message: 'Order already canceled',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  OrderAlreadyDelivered: {
    code: 'K0011',
    message: 'Order already delivered',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  OrderAlreadyUpdated: {
    code: 'K0012',
    message: 'Order already updated',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  UserNotExist: {
    code: 'K0013',
    message: 'User not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.ValidationError,
  },
  MissFieldQuantity: {
    code: 'K0014',
    message: 'Miss field quantity',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },

  // Group L (Payment)
  ZaloPayPaymentFailed: {
    code: 'L0001',
    message: 'ZaloPay payment failed',
    statusCode: 500,
    typeError: TYPE_ERRORS.InternalServerError,
  },

  // Group M (Statistic)
  StartDateEndDateRequired: {
    code: 'M0001',
    message: 'Start date and end date are required',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },
  StartDateMustBeBeforeEndDate: {
    code: 'M0002',
    message: 'Start date must be before end date',
    statusCode: 400,
    typeError: TYPE_ERRORS.ValidationError,
  },

  // Group N (Warehouse)
  WarehouseNameExist: {
    code: 'N0001',
    message: 'Warehouse name is already existed',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },
  WarehouseNotFound: {
    code: 'N0002',
    message: 'Warehouse not found',
    statusCode: 404,
    typeError: TYPE_ERRORS.NotFoundError,
  },
  WarehouseHasStock: {
    code: 'N0003',
    message: 'Warehouse has stock',
    statusCode: 409,
    typeError: TYPE_ERRORS.ValidationError,
  },

  // Group O (Review)
  ReviewNotExist: {
    code: 'O0001',
    message: 'Review not exist',
    statusCode: 404,
    typeError: TYPE_ERRORS.NotFoundError,
  },
};
