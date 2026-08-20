import Joi from 'joi';

export const createOrderSchema = {
  body: Joi.object({
    amount: Joi.number().integer().min(100).required().messages({
      'number.min': 'Minimum recharge is ₹1 (100 paise)',
    }),
    coins: Joi.number().integer().min(1).required(),
  }),
};
