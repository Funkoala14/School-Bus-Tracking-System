import { Router } from 'express';
import { getDriverList, getParentList, getStudentList, getUserList } from '../controllers/UserController.js';
import { jwtValidation } from '../middleware/AuthMiddleware.js';

const userRouter = Router();

userRouter
    .get('/all', jwtValidation ,getUserList)
    .get('drivers', jwtValidation, getDriverList)
    .get('/parents', jwtValidation, getParentList)
    .get('/students', jwtValidation, getStudentList);

export default userRouter;
