import { Schema, model } from 'mongoose';
export interface IUser {
  name: string; email: string; password: string; role: 'user' | 'admin';
  refreshToken?: string | null;
}
const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  refreshToken: { type: String, select: false, default: null },
}, { timestamps: true });
export const User = model<IUser>('User', userSchema);
