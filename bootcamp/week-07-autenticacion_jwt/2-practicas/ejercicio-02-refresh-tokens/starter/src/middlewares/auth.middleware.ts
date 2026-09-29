import type { RequestHandler } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';
export const authMiddleware: RequestHandler = async (req, _res, next) => {
  const token: unknown = req.cookies?.accessToken;
  if (typeof token !== 'string' || !token) { next(new AppError(401, 'No autenticado')); return; }
  try { req.user = verifyAccessToken(token); }
  catch { next(new AppError(401, 'Token inválido o expirado')); return; }
  next();
};
