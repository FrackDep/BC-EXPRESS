import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/requireRole';
import { getPublic, getDashboard, getUsers } from '../controllers/user.controller';
export const userRouter = Router();
userRouter.get('/public', getPublic);
userRouter.get('/dashboard', authMiddleware, requireRole('user', 'admin'), getDashboard);
userRouter.get('/users/dashboard', authMiddleware, requireRole('user', 'admin'), getDashboard);
userRouter.get('/admin/users', authMiddleware, requireRole('admin'), getUsers);
