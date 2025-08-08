import express from 'express';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { logger } from '@/utils/logger';

export interface MallOSPlugin {
  register(app: express.Application, io: Server): void | Promise<void>;
}

export const loadPlugins = async (app: express.Application, io: Server): Promise<void> => {
  const pluginsDir = __dirname;
  const files = fs
    .readdirSync(pluginsDir)
    .filter((file) => file !== 'index.ts' && (file.endsWith('.ts') || file.endsWith('.js')));

  for (const file of files) {
    try {
      const pluginPath = path.join(pluginsDir, file);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pluginModule = require(pluginPath);
      const plugin: MallOSPlugin = pluginModule.default || pluginModule;
      if (plugin && typeof plugin.register === 'function') {
        await plugin.register(app, io);
        logger.info(`✅ Plugin loaded: ${file}`);
      }
    } catch (error) {
      logger.error(`❌ Failed to load plugin ${file}:`, error);
    }
  }
};

export default loadPlugins;
