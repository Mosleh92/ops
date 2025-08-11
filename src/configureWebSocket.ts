import { Server } from 'socket.io';
import { aiAnalyticsService } from '@/services/AIAnalyticsService';
import { iotService } from '@/services/IoTService';
import { logger } from '@/utils/logger';

export function configureWebSocket(io: Server): void {
  io.use((socket, next) => {
    const token = (socket.handshake as any).auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    socket.data.user = { id: 'user-id', mallId: 'mall-id' };
    next();
  });

  io.on('connection', (socket) => {
    logger.info(`🔌 Client connected: ${socket.id}`);
    socket.join(`mall-${(socket.data as any).user.mallId}`);

    socket.on('subscribe-iot-data', (data) => {
      const { sensorType, deviceId } = data;
      socket.join(`iot-${sensorType}-${deviceId}`);
      logger.info(`📡 Client ${socket.id} subscribed to IoT data: ${sensorType}`);
    });

    socket.on('subscribe-ai-predictions', (data) => {
      const { type } = data;
      socket.join(`ai-${type}`);
      logger.info(`🤖 Client ${socket.id} subscribed to AI predictions: ${type}`);
    });

    socket.on('subscribe-cv-alerts', (data) => {
      const { cameraId } = data;
      socket.join(`cv-${cameraId}`);
      logger.info(`👁️ Client ${socket.id} subscribed to CV alerts: ${cameraId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  iotService.on('sensorData', (data) => {
    io.to(`iot-${data.sensorType}-${data.deviceId}`).emit('sensor-data', data);
    io.to(`mall-${data.mallId}`).emit('iot-update', {
      type: 'sensor-data',
      data,
    });
  });

  iotService.on('sensorAlert', (alert) => {
    io.to(`mall-${alert.mallId}`).emit('iot-alert', {
      type: 'sensor-alert',
      data: alert,
    });
  });

  iotService.on('deviceStatusUpdate', (update) => {
    io.to(`mall-${update.mallId}`).emit('device-status', {
      type: 'device-status',
      data: update,
    });
  });

  aiAnalyticsService.on('predictionCompleted', (prediction) => {
    io.to(`ai-${prediction.type}`).emit('ai-prediction', {
      type: 'prediction-completed',
      data: prediction,
    });
  });

  aiAnalyticsService.on('modelTrained', (model) => {
    io.to(`mall-${model.mallId}`).emit('ai-model', {
      type: 'model-trained',
      data: model,
    });
  });
}

