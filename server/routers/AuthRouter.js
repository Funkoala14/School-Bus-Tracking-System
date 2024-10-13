import { Router } from 'express';

const authRouter = Router();

authRouter
    .get('/verify', jwtValidation, getVerifyToken)
    .get('/logout', getUserLogout)
    .post('/register', createUserValidation, postCreateUser)
    .post('/login', loginValidation, postUserLogin);

export default authRouter;
