export enum OrderStatus {
  DELIVERED = 'DELIVERED',
  ON_PROCESS = 'ON_PROCESS',
  WAIT_FOR_PAYMENT = 'WAIT_FOR_PAYMENT',
  CANCELED = 'CANCELED',
}

export enum OrderPaymentMethod {
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum OrderPaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

export enum OrderDeliveryMethod {
  NORMAL = 'NORMAL',
  FAST = 'FAST',
}
