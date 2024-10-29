import { Router } from 'express';
import { postAddStudent } from '../controllers/ParentController.js';
import { jwtValidation } from '../middleware/AuthMiddleware.js';
import { parentAddStudentValidation } from '../middleware/ValidationMiddleware.js';

const parentRouter = Router();

parentRouter.post('/add-student', parentAddStudentValidation, jwtValidation, postAddStudent);

export default parentRouter;
