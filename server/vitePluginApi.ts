import type { Plugin } from 'vite';
import express from 'express';
import { apiRouter } from './apiRouter.ts';
import dotenv from 'dotenv';

dotenv.config();

export function vitePluginApi(): Plugin {
  return {
    name: 'vite-plugin-lifecraft-api',
    configureServer(server) {
      const app = express();
      app.use(express.json());
      app.use(apiRouter);
      server.middlewares.use('/api', (req, res, next) => {
        app(req as any, res as any, next);
      });
    },
  };
}
