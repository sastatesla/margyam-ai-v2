import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import adminRoutes from './admin.routes.js';
import publicRoutes from './public.routes.js';
import mapRoutes from './map.routes.js';
import analyticsRoutes from './analytics.routes.js';
import roleRoutes from './role.routes.js';

const router = express.Router();

const routes = [
  { name: 'Auth',      path: '/auth',      router: authRoutes },
  { name: 'Users',     path: '/users',     router: userRoutes },
  { name: 'Admin',     path: '/admin',     router: adminRoutes },
  { name: 'Public',    path: '/public',    router: publicRoutes },
  { name: 'Map',       path: '/map',       router: mapRoutes },
  { name: 'Analytics', path: '/analytics', router: analyticsRoutes },
  { name: 'Roles',     path: '/roles',     router: roleRoutes },
];

const mountRoutes = (appRouter, routeConfig) => {
  routeConfig.forEach(({ path, router: r }) => appRouter.use(path, r));
};

mountRoutes(router, routes);

export default router;

