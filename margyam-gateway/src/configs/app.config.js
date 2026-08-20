const config = {
  env:         process.env.NODE_ENV         || 'development',
  port:        parseInt(process.env.PORT)   || 3000,
  corsOrigins: (process.env.CORS_ORIGINS    || 'http://localhost:3001').split(','),

  jwt: {
    secret:     process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION  || '7d',
  },

  mongo: {
    uri: process.env.DATABASE_URL,
  },

  redis: {
    host: process.env.REDIS_HOST            || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT)  || 6379,
    password: process.env.REDIS_PASSWORD    || undefined,
  },

  grpc: {
    astroAddress:  process.env.ASTRO_GRPC_ADDRESS  || 'localhost:50051',
    ledgerAddress: process.env.LEDGER_GRPC_ADDRESS || 'localhost:50052',
  },

  fcm: {
    projectId: process.env.FCM_PROJECT_ID,
  },
};

export default config;
