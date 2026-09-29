import { Schema, model, Types } from 'mongoose';
export interface ISpace {
  code: string; name: string; zone: 'patio' | 'biblioteca' | 'terraza';
  kind: 'focus-booth' | 'shared-desk' | 'meeting-room';
  capacity: number; hourlyRateCop: number; available: boolean; addedBy: Types.ObjectId;
}
const spaceSchema = new Schema<ISpace>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  zone: { type: String, enum: ['patio', 'biblioteca', 'terraza'], required: true },
  kind: { type: String, enum: ['focus-booth', 'shared-desk', 'meeting-room'], required: true },
  capacity: { type: Number, required: true, min: 1, max: 30 },
  hourlyRateCop: { type: Number, required: true, min: 1000, max: 1000000 },
  available: { type: Boolean, default: true },
  addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export const Space = model<ISpace>('Space', spaceSchema);
