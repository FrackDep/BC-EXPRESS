import { Router } from 'express';
import * as auth from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
export const authRouter = Router();
authRouter.post('/register', auth.register);
authRouter.post('/login', auth.login);
authRouter.get('/me', authMiddleware, auth.me);
authRouter.post('/refresh', auth.refresh);
authRouter.post('/logout', authMiddleware, auth.logout);
