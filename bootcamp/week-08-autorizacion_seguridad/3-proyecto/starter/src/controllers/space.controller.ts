import type { Request, Response } from 'express';
import * as spaces from '../services/space.service';
import { createSpaceSchema, updateSpaceSchema } from '../schemas/space.schema';
export async function listSpaces(_req: Request, res: Response): Promise<void> { res.json({ data: await spaces.listSpaces() }); }
export async function getSpace(req: Request, res: Response): Promise<void> { res.json(await spaces.getSpace(String(req.params.id))); }
export async function createSpace(req: Request, res: Response): Promise<void> { res.status(201).json(await spaces.createSpace(createSpaceSchema.parse(req.body), req.user!.sub)); }
export async function updateSpace(req: Request, res: Response): Promise<void> { res.json(await spaces.updateSpace(String(req.params.id), updateSpaceSchema.parse(req.body))); }
export async function deleteSpace(req: Request, res: Response): Promise<void> { await spaces.deleteSpace(String(req.params.id)); res.status(204).end(); }
