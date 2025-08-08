import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * Rate Limiter Middleware
 * Provides protection against brute force attacks and API abuse
 */

// General rate limiter for all routes
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Stricter rate limiter for authentication routes
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// API rate limiter for different user tiers
export const apiRateLimiter = (maxRequests: number = 100) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: maxRequests,
    message: {
      error: 'API rate limit exceeded, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      // Use user ID if authenticated, otherwise use IP
      return req.user?.id || req.ip;
    },
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        error: 'API rate limit exceeded, please try again later.',
        retryAfter: '15 minutes'
      });
    }
  });
};

// IoT data rate limiter (higher limits for IoT devices)
export const iotRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // Higher limit for IoT devices
  message: {
    error: 'IoT rate limit exceeded.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'IoT rate limit exceeded.',
      retryAfter: '1 minute'
    });
  }
});

// Admin rate limiter (higher limits for admin users)
export const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Higher limit for admin users
  message: {
    error: 'Admin rate limit exceeded.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.user?.id || req.ip;
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Admin rate limit exceeded.',
      retryAfter: '15 minutes'
    });
  }
});
