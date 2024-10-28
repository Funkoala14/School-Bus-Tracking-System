import { Router } from 'express';
import { getUserProfile } from '../controllers/UserController.js';
import { jwtValidation } from '../middleware/AuthMiddleware.js';

const userRouter = Router();

userRouter.get('/profile', jwtValidation, getUserProfile);

export default userRouter;
