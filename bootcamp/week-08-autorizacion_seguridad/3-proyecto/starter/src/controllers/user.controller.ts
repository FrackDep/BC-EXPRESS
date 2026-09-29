import type { Request, Response } from 'express';
import { listUsers } from '../repositories/users.repository';
export function getPublic(_req: Request, res: Response): void { res.json({ coworking: 'Flanchito space', city: 'Bogotá', message: 'Un patio para concentrarte y compartir ideas' }); }
export function getDashboard(req: Request, res: Response): void { res.json({ message: 'Bienvenido a Flanchito space', member: req.user!.email, role: req.user!.role }); }
export async function getUsers(_req: Request, res: Response): Promise<void> { res.json({ data: await listUsers() }); }
