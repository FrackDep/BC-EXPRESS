import { z } from 'zod';
export const createSpaceSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^FS-(PA|BI|TE)-[0-9]{2}$/, 'Usa FS-PA-01, FS-BI-01 o FS-TE-01'),
  name: z.string().trim().min(3).max(80).regex(/^[^<>]+$/, 'El nombre no admite etiquetas HTML'),
  zone: z.enum(['patio', 'biblioteca', 'terraza']),
  kind: z.enum(['focus-booth', 'shared-desk', 'meeting-room']),
  capacity: z.number().int().min(1).max(30),
  hourlyRateCop: z.number().int().min(1000).max(1000000),
  available: z.boolean().optional(),
}).strict();
export const updateSpaceSchema = createSpaceSchema.partial().refine(value => Object.keys(value).length > 0, 'Envía al menos un campo');
export type CreateSpaceDto = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceDto = z.infer<typeof updateSpaceSchema>;
