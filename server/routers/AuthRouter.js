import { Router } from 'express';
import { jwtValidation } from '../middleware/AuthMiddleware.js';
import { getUserLogout, getVerifyToken, postCreateUser, postUserLogin } from '../controllers/AuthController.js';
import { createUserValidation, loginValidation } from '../middleware/ValidationMiddleware.js';

const authRouter = Router();

authRouter
    .get('/verify', jwtValidation, getVerifyToken)
	.get('/logout', getUserLogout)
    .post('/register', createUserValidation, postCreateUser)
    .post('/login', loginValidation, postUserLogin);

export default authRouter;
