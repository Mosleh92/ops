import express from 'express';
import { Server } from 'socket.io';
import { MallOSPlugin } from './index';
import { logger } from '@/utils/logger';

const examplePlugin: MallOSPlugin = {
  register(app: express.Application, io: Server): void {
    app.get('/plugin-example', (_req, res) => {
      res.json({ success: true, message: 'Example plugin active' });
    });

    io.on('connection', (socket) => {
      socket.emit('plugin-example', 'Plugin example connected');
    });

    logger.info('🚀 Example plugin registered');
  }
};

export default examplePlugin;
