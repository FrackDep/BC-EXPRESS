import { Space } from '../models/space.model';
import type { CreateSpaceDto, UpdateSpaceDto } from '../schemas/space.schema';
export const list = () => Space.find().sort({ code: 1 });
export const findById = (id: string) => Space.findById(id);
export const create = (dto: CreateSpaceDto, addedBy: string) => Space.create({ ...dto, addedBy });
export const update = (id: string, dto: UpdateSpaceDto) => Space.findByIdAndUpdate(id, { $set: dto }, { returnDocument: 'after', runValidators: true });
export const remove = (id: string) => Space.findByIdAndDelete(id);
