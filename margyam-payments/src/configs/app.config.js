const config = {
  env:         process.env.NODE_ENV         || 'development',
  port:        parseInt(process.env.PORT)   || 3001,
  corsOrigins: (process.env.CORS_ORIGINS    || 'http://localhost:3000').split(','),

  jwt: {
    secret:     process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION  || '7d',
  },

  postgres: {
    url: process.env.DATABASE_URL,
  },

  grpc: {
    port: parseInt(process.env.GRPC_PORT) || 50052,
  },

  phonePe: {
    merchantId:  process.env.PHONEPE_MERCHANT_ID,
    apiKey:      process.env.PHONEPE_API_KEY,
    env:         process.env.PHONEPE_ENV   || 'UAT',  // UAT | PROD
  },
};

export default config;
