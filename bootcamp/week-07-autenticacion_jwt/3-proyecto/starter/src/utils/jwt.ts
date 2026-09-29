import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { env } from '../config/env';
export interface AccessPayload { sub: string; email: string; role: 'user' | 'admin'; }
export function signAccessToken(payload: AccessPayload): string {
  return jwt.sign({ ...payload, type: 'access' }, env.accessSecret, { algorithm: 'HS256', expiresIn: '15m', jwtid: randomUUID() });
}
export function verifyAccessToken(token: string): AccessPayload {
  const payload = jwt.verify(token, env.accessSecret, { algorithms: ['HS256'] });
  if (typeof payload === 'string' || payload.type !== 'access' || typeof payload.sub !== 'string' || !/^[a-f0-9]{24}$/.test(payload.sub) || typeof payload.email !== 'string' || !['user', 'admin'].includes(payload.role)) throw new Error('JWT inválido');
  return { sub: payload.sub, email: payload.email, role: payload.role };
}
export function signRefreshToken(sub: string): string {
  return jwt.sign({ sub, type: 'refresh' }, env.refreshSecret, { algorithm: 'HS256', expiresIn: '7d', jwtid: randomUUID() });
}
export function verifyRefreshToken(token: string): { sub: string } {
  const payload = jwt.verify(token, env.refreshSecret, { algorithms: ['HS256'] });
  if (typeof payload === 'string' || payload.type !== 'refresh' || typeof payload.sub !== 'string' || !/^[a-f0-9]{24}$/.test(payload.sub)) throw new Error('JWT inválido');
  return { sub: payload.sub };
}
