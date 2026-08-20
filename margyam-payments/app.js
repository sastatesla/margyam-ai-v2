import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { logger } from './src/common/index.js';

import appConfig from './src/configs/app.config.js';
import { connectDB } from './src/configs/db.js';
import v1Router from './src/routes/v1.routes.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { startGrpcServer } from './src/system/grpc/server.js';

const app = express();

// Global middlewares
app.use(helmet());
app.use(cors({ origin: appConfig.corsOrigins, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'margyam-payments' }));

// API v1 routes
app.use('/api/v1', v1Router);

// Global error handling middleware
app.use(errorHandler);

// Application boot function
const start = async () => {
  await connectDB();
  await startGrpcServer();

  app.listen(appConfig.port, () => {
    logger.info(`margyam-payments running on port ${appConfig.port} [${appConfig.env}]`);
  });
};

start().catch((err) => {
  logger.error('Failed to start margyam-payments', { error: err.message });
  process.exit(1);
});

export default app;
