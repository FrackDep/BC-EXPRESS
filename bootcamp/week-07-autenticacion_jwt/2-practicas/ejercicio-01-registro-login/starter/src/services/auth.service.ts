import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError';
import * as users from '../repositories/users.repository';
import { signAccessToken } from '../utils/jwt';
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
  return { accessToken: signAccessToken({ sub: user._id.toString(), email: user.email, role: user.role }) };
}
export async function login(dto: LoginDto) {
  const user = await users.findByEmailWithPassword(dto.email);
  if (!user || !(await bcrypt.compare(dto.password, user.password))) throw new AppError(401, 'Credenciales inválidas');
  const tokens = tokensFor(user);
  return { user: profile(user), tokens };
}
export async function getMe(id: string) {
  const user = await users.findById(id);
  if (!user) throw new AppError(401, 'Sesión no válida');
  return profile(user);
}
