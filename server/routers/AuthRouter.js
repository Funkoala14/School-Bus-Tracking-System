import { Router } from 'express';
import { createUserValidation, jwtValidation, loginValidation } from '../middleware/AuthMiddleware.js';
import { getUserLogout, getVerifyToken, postCreateUser, postUserLogin } from '../controllers/AuthController.js';

const authRouter = Router();

authRouter
    .get('/verify', jwtValidation, getVerifyToken)
	.get('/logout', getUserLogout)
    .post('/register', createUserValidation, postCreateUser)
    .post('/login', loginValidation, postUserLogin);

export default authRouter;
