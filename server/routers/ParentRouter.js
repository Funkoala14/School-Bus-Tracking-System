import { Router } from 'express';
import { getChildrenDetail, getParentProfile, postAddStudent, postRemoveStudent, postSetAddress, postUpdateParentProfile } from '../controllers/ParentController.js';
import { checkPermission, jwtValidation } from '../middleware/AuthMiddleware.js';
import { parentAddStudentValidation, setAddressValidation } from '../middleware/ValidationMiddleware.js';

const parentRouter = Router();

parentRouter
    .get('/children-info', jwtValidation, getChildrenDetail)
    .post('/add-student', parentAddStudentValidation, jwtValidation, postAddStudent)
    .post('/remove-student', jwtValidation, checkPermission('Parent'), postRemoveStudent)
    .post('/set-address', jwtValidation, checkPermission('Parent'), setAddressValidation, postSetAddress)
    .get('/profile', jwtValidation, getParentProfile)
    .post('/update', jwtValidation, postUpdateParentProfile)

export default parentRouter;
