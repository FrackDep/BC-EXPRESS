import { z } from 'zod';
const email = z.string().trim().toLowerCase().email().max(254);
const password = z.string().min(8).max(72).refine(value => Buffer.byteLength(value, 'utf8') <= 72, 'Máximo 72 bytes');
export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80).regex(/^[^<>]+$/, 'El nombre no admite etiquetas HTML'),
  email, password,
}).strict();
export const loginSchema = z.object({ email, password: z.string().min(1).max(72).refine(value => Buffer.byteLength(value, 'utf8') <= 72) }).strict();
export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
