import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { aiAnalyticsService } from '@/services/AIAnalyticsService';
import { iotService } from '@/services/IoTService';
import { databaseManager } from '@/config/database';
import { redis } from '@/config/redis';
import { logger } from '@/utils/logger';

export function setupGracefulShutdown(server: HTTPServer, io: IOServer): void {
  const gracefulShutdown = async (signal: string) => {
    logger.info(`🛑 Received ${signal}. Starting graceful shutdown...`);
    try {
      io.close(() => {
        logger.info('✅ Socket.IO server closed');
      });
      server.close(() => {
        logger.info('✅ HTTP server closed');
      });
      await iotService.cleanup();
      await aiAnalyticsService.cleanup();
      await databaseManager.close();
      await redis.disconnect();
      logger.info('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during graceful shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

