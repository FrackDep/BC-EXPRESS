import bcrypt from 'bcrypt';
import { createHash } from 'node:crypto';
import { AppError } from '../errors/AppError';
import * as users from '../repositories/users.repository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import type { RegisterDto, LoginDto } from '../schemas/auth.schema';
import type { IUser } from '../models/user.model';
import type { Types } from 'mongoose';
type Member = IUser & { _id: Types.ObjectId };
export function profile(user: Member) { return { id: user._id.toString(), name: user.name, email: user.email, role: user.role }; }
export async function register(dto: RegisterDto) {
  if (await users.findByEmail(dto.email)) throw new AppError(409, 'El email ya está registrado');
  return profile(await users.create({ ...dto, password: await bcrypt.hash(dto.password, 10) }));
}
function tokensFor(user: Member) {
  return { accessToken: signAccessToken({ sub: user._id.toString(), email: user.email, role: user.role }), refreshToken: signRefreshToken(user._id.toString()) };
}
const digest = (token: string) => createHash('sha256').update(token).digest('hex');
export async function login(dto: LoginDto) {
  const user = await users.findByEmailWithPassword(dto.email);
  if (!user || !(await bcrypt.compare(dto.password, user.password))) throw new AppError(401, 'Credenciales inválidas');
  const tokens = tokensFor(user);
  await users.updateRefreshToken(user._id.toString(), await bcrypt.hash(digest(tokens.refreshToken), 10));
  return { user: profile(user), tokens };
}
export async function getMe(id: string) {
  const user = await users.findById(id);
  if (!user) throw new AppError(401, 'Sesión no válida');
  return profile(user);
}
export async function refresh(token: string) {
  let sub: string;
  try { sub = verifyRefreshToken(token).sub; } catch { throw new AppError(401, 'Refresh token inválido o expirado'); }
  const user = await users.findByIdWithTokens(sub);
  if (!user?.refreshToken || !(await bcrypt.compare(digest(token), user.refreshToken))) throw new AppError(401, 'Refresh token inválido o expirado');
  const tokens = tokensFor(user);
  const result = await users.rotateRefreshToken(sub, user.refreshToken, await bcrypt.hash(digest(tokens.refreshToken), 10));
  if (result.modifiedCount !== 1) throw new AppError(401, 'Refresh token inválido o expirado');
  return tokens;
}
export async function logout(id: string) { await users.clearRefreshToken(id); }
