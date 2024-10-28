import { Router } from 'express';
import { checkPermission, jwtValidation } from '../middleware/AuthMiddleware.js';
import { getDriverList, getParentList, getStudentList, getUserList, postSchoolAddStudent } from '../controllers/AdminController.js';

const adminRouter = Router();

adminRouter
    .get('/all', jwtValidation, checkPermission('Admin'), getUserList)
    .get('/drivers', jwtValidation, getDriverList)
    .get('/parents', jwtValidation, getParentList)
    .get('/students', jwtValidation, getStudentList)
    .post('/add-students', jwtValidation, postSchoolAddStudent);

export default adminRouter;
