import * as spaces from '../repositories/space.repository';
import type { CreateSpaceDto, UpdateSpaceDto } from '../schemas/space.schema';
import { AppError } from '../errors/AppError';
function validId(id: string): void { if (!/^[a-fA-F0-9]{24}$/.test(id)) throw new AppError(400, 'Identificador de espacio inválido'); }
function checkSpace(space: CreateSpaceDto): void {
  const prefix = { patio: 'PA', biblioteca: 'BI', terraza: 'TE' }[space.zone];
  if (!space.code.startsWith(`FS-${prefix}-`)) throw new AppError(400, 'El código debe corresponder a la zona del coworking');
  if (space.kind !== 'meeting-room' && space.capacity !== 1) throw new AppError(400, 'Cabinas y puestos compartidos tienen capacidad individual');
  if (space.kind === 'meeting-room' && space.capacity < 2) throw new AppError(400, 'Las salas requieren al menos dos puestos');
}
export const listSpaces = () => spaces.list();
export async function getSpace(id: string) {
  validId(id); const space = await spaces.findById(id);
  if (!space) throw new AppError(404, 'Espacio no encontrado');
  return space;
}
export async function createSpace(dto: CreateSpaceDto, memberId: string) { checkSpace(dto); return spaces.create(dto, memberId); }
export async function updateSpace(id: string, dto: UpdateSpaceDto) {
  const previous = await getSpace(id);
  checkSpace({ ...previous.toObject(), ...dto });
  const space = await spaces.update(id, dto);
  if (!space) throw new AppError(404, 'Espacio no encontrado');
  return space;
}
export async function deleteSpace(id: string) {
  validId(id); if (!(await spaces.remove(id))) throw new AppError(404, 'Espacio no encontrado');
}
