import { Router } from 'express';
import { getUserProfile } from '../controllers/UserController.js';
import { jwtValidation } from '../middleware/AuthMiddleware.js';
import { sendArrivalNotification } from '../controllers/NotificationController.js';

const userRouter = Router();

userRouter.get('/profile', jwtValidation, getUserProfile).get('/test', sendArrivalNotification);

export default userRouter;
