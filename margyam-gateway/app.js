import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { Server as SocketServer } from 'socket.io';
import { logger } from './src/common/index.js';

import appConfig from './src/configs/app.config.js';
import { connectDB } from './src/configs/db.js';
import { connectRedis } from './src/configs/redis.js';
import v1Router from './src/routes/v1.routes.js';
import { initChatSocket } from './src/sockets/chat.socket.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import mongoSanitizeMiddleware from './src/middlewares/mongoSanitize.js';
import { xssClean } from './src/middlewares/xss.js';

const app = express();
const server = http.createServer(app);

// Socket.io initialization
export const io = new SocketServer(server, {
  cors: { origin: appConfig.corsOrigins, credentials: true },
});
initChatSocket(io);

// Global middlewares
app.use(helmet());
app.use(cors({ origin: appConfig.corsOrigins, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitizeMiddleware);
app.use(xssClean);

// Health check endpoint
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'margyam-gateway' }));

// API v1 routes
app.use('/api/v1', v1Router);

// Global error handling middleware
app.use(errorHandler);

// Application boot function
const start = async () => {
  await connectDB();
  await connectRedis();

  server.listen(appConfig.port, () => {
    logger.info(`margyam-gateway running on port ${appConfig.port} [${appConfig.env}]`);
  });
};

start().catch((err) => {
  logger.error('Failed to start margyam-gateway', { error: err.message });
  process.exit(1);
});

export default app;
