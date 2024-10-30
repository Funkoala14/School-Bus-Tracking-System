import { Router } from 'express';
import { getRouteDetail, postAddStudent, postRemoveStudent, postSetAddress } from '../controllers/ParentController.js';
import { checkPermission, jwtValidation } from '../middleware/AuthMiddleware.js';
import { parentAddStudentValidation, setAddressValidation } from '../middleware/ValidationMiddleware.js';

const parentRouter = Router();

parentRouter
    .get('/route', jwtValidation, getRouteDetail)
    .post('/add-student', parentAddStudentValidation, jwtValidation, checkPermission('Parent'), postAddStudent)
    .post('/remove-student', jwtValidation, checkPermission('Parent'), postRemoveStudent)
    .post('/set-address', jwtValidation, checkPermission('Parent'), setAddressValidation, postSetAddress);

export default parentRouter;
