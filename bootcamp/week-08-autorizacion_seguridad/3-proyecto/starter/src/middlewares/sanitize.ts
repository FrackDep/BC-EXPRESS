import type { RequestHandler } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import { AppError } from '../errors/AppError';
export const sanitize: RequestHandler = (req, _res, next) => {
  const query = req.query;
  const unsafe = [req.body, req.params, query].some(value => value && mongoSanitize.has(value, false));
  if (req.body && typeof req.body === 'object') req.body = mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.params);
  mongoSanitize.sanitize(query);
  if (unsafe) {
    const login = req.path === '/api/v1/auth/login';
    next(new AppError(login ? 401 : 400, login ? 'Credenciales inválidas' : 'Claves de entrada no permitidas'));
    return;
  }
  next();
};
