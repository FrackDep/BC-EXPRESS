import type { RequestHandler } from 'express';
import { AppError } from '../errors/AppError';
export function requireRole(...roles: Array<'user' | 'admin'>): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) { next(new AppError(401, 'No autenticado')); return; }
    if (!roles.includes(req.user.role)) { next(new AppError(403, 'No tienes permiso para esta operación')); return; }
    next();
  };
}
