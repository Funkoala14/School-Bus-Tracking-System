import { Router } from 'express';
import { checkPermission, jwtValidation } from '../middleware/AuthMiddleware.js';
import { getDriverList, getParentList, getStudentList, getUserList, postAssignStopToStudent, postSchoolAddStudent } from '../controllers/AdminController.js';
import { adminAddStudentValidation } from '../middleware/ValidationMiddleware.js';
import { generateRouteSchedule } from '../controllers/RouteScheduleController.js';

const adminRouter = Router();

adminRouter
    .get('/all', jwtValidation, checkPermission('Admin'), getUserList)
    .get('/drivers', jwtValidation, checkPermission('Admin'), getDriverList)
    .get('/parents', jwtValidation, checkPermission('Admin'), getParentList)
    .get('/students', jwtValidation, checkPermission('Admin'), getStudentList)
    .post('/add-students', adminAddStudentValidation, checkPermission('Admin'), jwtValidation, postSchoolAddStudent)
    .post('/assign-stop', jwtValidation, checkPermission('Admin'), postAssignStopToStudent)
    .post('/generate-schedule', jwtValidation, checkPermission('Admin'), generateRouteSchedule);


export default adminRouter;
