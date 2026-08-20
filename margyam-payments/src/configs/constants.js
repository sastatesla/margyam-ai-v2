export const PaymentStatus = Object.freeze({
  PENDING:    'PENDING',
  SUCCESS:    'SUCCESS',
  FAILED:     'FAILED',
  REFUNDED:   'REFUNDED',
  CANCELLED:  'CANCELLED',
});

export const OrderStatus = Object.freeze({
  CREATED:    'CREATED',
  PAID:       'PAID',
  PROCESSING: 'PROCESSING',
  COMPLETED:  'COMPLETED',
  CANCELLED:  'CANCELLED',
  REFUNDED:   'REFUNDED',
});

export const TransactionType = Object.freeze({
  CREDIT:     'CREDIT',
  DEBIT:      'DEBIT',
  REFUND:     'REFUND',
  BONUS:      'BONUS',
  REFERRAL:   'REFERRAL',
});
