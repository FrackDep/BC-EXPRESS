import type { Request, Response, CookieOptions } from 'express';
import { env } from '../config/env';
import * as auth from '../services/auth.service';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { AppError } from '../errors/AppError';
const cookieOptions = (path: string): CookieOptions => ({ httpOnly: true, secure: env.production, sameSite: 'lax', path });
function setCookies(res: Response, tokens: { accessToken: string }): void {
  res.cookie('accessToken', tokens.accessToken, { ...cookieOptions('/'), maxAge: 15 * 60 * 1000 });
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
