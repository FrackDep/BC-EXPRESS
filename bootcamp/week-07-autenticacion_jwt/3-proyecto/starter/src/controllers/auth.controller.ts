import type { Request, Response, CookieOptions } from 'express';
import { env } from '../config/env';
import * as auth from '../services/auth.service';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { AppError } from '../errors/AppError';
const cookieOptions = (path: string): CookieOptions => ({ httpOnly: true, secure: env.production, sameSite: 'lax', path });
function setCookies(res: Response, tokens: { accessToken: string; refreshToken: string }): void {
  res.cookie('accessToken', tokens.accessToken, { ...cookieOptions('/'), maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', tokens.refreshToken, { ...cookieOptions('/api/v1/auth'), maxAge: 7 * 24 * 60 * 60 * 1000 });
}
export async function register(req: Request, res: Response): Promise<void> {
  res.status(201).json(await auth.register(registerSchema.parse(req.body)));
}
export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(401, 'Credenciales inválidas');
  const result = await auth.login(parsed.data);
  setCookies(res, result.tokens);
  res.json(result.user);
}
export async function me(req: Request, res: Response): Promise<void> { res.json(await auth.getMe(req.user!.sub)); }
export async function refresh(req: Request, res: Response): Promise<void> {
  const token: unknown = req.cookies?.refreshToken;
  if (typeof token !== 'string' || !token) throw new AppError(401, 'Refresh token requerido');
  setCookies(res, await auth.refresh(token));
  res.json({ message: 'Sesión renovada en Flanchito space' });
}
export async function logout(req: Request, res: Response): Promise<void> {
  await auth.logout(req.user!.sub);
  res.clearCookie('accessToken', cookieOptions('/'));
  res.clearCookie('refreshToken', cookieOptions('/api/v1/auth'));
  res.json({ message: 'Sesión cerrada' });
}
