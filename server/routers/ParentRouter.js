import { Router } from 'express';
import { postAddStudent } from '../controllers/ParentController.js';
import { jwtValidation } from '../middleware/AuthMiddleware.js';
import { parentAddStudent } from '../middleware/ValidationMiddleware.js';

const parentRouter = Router();

parentRouter.post('/add-student',parentAddStudent, jwtValidation, postAddStudent);

export default parentRouter;
