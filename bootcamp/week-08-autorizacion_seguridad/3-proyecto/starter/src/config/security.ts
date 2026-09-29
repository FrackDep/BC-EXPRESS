import rateLimit from 'express-rate-limit';
import type { CorsOptions } from 'cors';
import { env } from './env';
import { AppError } from '../errors/AppError';
export const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-6', legacyHeaders: true, message: { message: 'Límite global alcanzado: intenta de nuevo en 15 minutos' } });
export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-6', legacyHeaders: true, message: { message: 'Límite de autenticación alcanzado: intenta de nuevo en 15 minutos' } });
export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || env.origins.includes(origin)) callback(null, true);
    else callback(new AppError(403, 'Origen no permitido'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset', 'X-RateLimit-Remaining'],
};
