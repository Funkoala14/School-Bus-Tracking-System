import { Router } from 'express';
import { postAddStudent } from '../controllers/ParentController.js';
import { jwtValidation } from '../middleware/AuthMiddleware.js';

const parentRouter = Router();

parentRouter.post('/add-student', jwtValidation, postAddStudent);

export default parentRouter;
