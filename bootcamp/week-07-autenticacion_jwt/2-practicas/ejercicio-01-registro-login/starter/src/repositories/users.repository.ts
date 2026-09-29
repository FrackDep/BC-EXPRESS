import { User } from '../models/user.model';
import type { RegisterDto } from '../schemas/auth.schema';
export const create = (dto: RegisterDto) => User.create({ name: dto.name, email: dto.email, password: dto.password, role: 'user' });
export const findByEmail = (email: string) => User.findOne({ email });
export const findByEmailWithPassword = (email: string) => User.findOne({ email }).select('+password');
export const findById = (id: string) => User.findById(id);
