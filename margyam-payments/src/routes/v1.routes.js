import express from 'express';
import paymentRoutes from './payment.routes.js';
import walletRoutes from './wallet.routes.js';

const router = express.Router();

const routes = [
  { name: 'Payment', path: '/payments', router: paymentRoutes },
  { name: 'Wallet',  path: '/wallet',   router: walletRoutes },
];

const mountRoutes = (appRouter, routeConfig) => {
  routeConfig.forEach(({ path, router: r }) => appRouter.use(path, r));
};

mountRoutes(router, routes);

export default router;
