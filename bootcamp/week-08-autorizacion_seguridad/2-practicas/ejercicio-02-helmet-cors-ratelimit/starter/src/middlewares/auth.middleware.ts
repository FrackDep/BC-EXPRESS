import type { RequestHandler } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';
import { findById } from '../repositories/users.repository';
export const authMiddleware: RequestHandler = async (req, _res, next) => {
  const token: unknown = req.cookies?.accessToken;
  if (typeof token !== 'string' || !token) { next(new AppError(401, 'No autenticado')); return; }
  try { req.user = verifyAccessToken(token); }
  catch { next(new AppError(401, 'Token inválido o expirado')); return; }
  const current = await findById(req.user.sub);
  if (!current) { next(new AppError(401, 'Sesión no válida')); return; }
  req.user.role = current.role;
  next();
};
