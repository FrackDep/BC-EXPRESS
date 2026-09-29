import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) { res.status(400).json({ message: 'Datos inválidos', fields: err.issues.map(i => ({ path: i.path.join('.'), message: i.message })) }); return; }
  if (err instanceof AppError) { res.status(err.statusCode).json({ message: err.message }); return; }
  if (err?.code === 11000) { res.status(409).json({ message: 'El registro ya existe' }); return; }
  if (err?.type === 'entity.parse.failed') { res.status(400).json({ message: 'JSON inválido' }); return; }
  if (err?.type === 'entity.too.large') { res.status(413).json({ message: 'Solicitud demasiado grande' }); return; }
  if (err?.name === 'ValidationError' || err?.name === 'CastError') { res.status(400).json({ message: 'Datos inválidos' }); return; }
  console.error('Error interno de la API');
  res.status(500).json({ message: 'Error interno del servidor' });
};
