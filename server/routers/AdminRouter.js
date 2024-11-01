import { Router } from 'express';
import { checkPermission, jwtValidation } from '../middleware/AuthMiddleware.js';
import { getDriverList, getParentList, getStudentList, getUserList, postAssignStopToStudent, postSchoolAddStudent } from '../controllers/AdminController.js';
import { adminAddStudentValidation } from '../middleware/ValidationMiddleware.js';

const adminRouter = Router();

adminRouter
    .get('/all', jwtValidation, checkPermission('Admin'), getUserList)
    .get('/drivers', jwtValidation, getDriverList)
    .get('/parents', jwtValidation, getParentList)
    .get('/students', jwtValidation, getStudentList)
    .post('/add-students', adminAddStudentValidation, jwtValidation, postSchoolAddStudent)
    .post('/assign-stop', jwtValidation, postAssignStopToStudent)


export default adminRouter;
