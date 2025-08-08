import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to attach a correlation ID to each request.
 * The ID is stored in AsyncLocalStorage so log entries can include it.
 */
export const asyncLocalStorage = new AsyncLocalStorage<{ correlationId: string }>();

export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  res.setHeader('X-Correlation-ID', correlationId);
  asyncLocalStorage.run({ correlationId }, () => next());
};

export default correlationIdMiddleware;
