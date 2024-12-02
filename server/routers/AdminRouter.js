import { Router } from 'express';
import { checkPermission, jwtValidation } from '../middleware/AuthMiddleware.js';
import { getDriverList, getParentList, getStudentList, getUserList, postAssignStopToStudent, postRemoveParent, postRemoveStudent, postSchoolAddStudent, postUpdateStudentInfo } from '../controllers/AdminController.js';
import { adminAddStudentValidation } from '../middleware/ValidationMiddleware.js';
import { generateRouteSchedule } from '../controllers/RouteScheduleController.js';
import { postAdminAddStudentForParent } from '../controllers/ParentController.js';

const adminRouter = Router();

adminRouter
    .get('/all', jwtValidation, checkPermission('Admin'), getUserList)
    .get('/drivers', jwtValidation, checkPermission('Admin'), getDriverList)
    .get('/parents', jwtValidation, checkPermission('Admin'), getParentList)
    .get('/students', jwtValidation, checkPermission('Admin'), getStudentList)
    .post('/add-student', jwtValidation, checkPermission('Admin'), postAdminAddStudentForParent)
    .post('/update-student', jwtValidation, checkPermission('Admin'), postUpdateStudentInfo)
    .post('/add-students',jwtValidation, adminAddStudentValidation, checkPermission('Admin'),  postSchoolAddStudent)
    .post('/assign-stop', jwtValidation, checkPermission('Admin'), postAssignStopToStudent)
    .post('/generate-schedule', jwtValidation, checkPermission('Admin'), generateRouteSchedule)
    .delete('/delete-parent', jwtValidation, checkPermission('Admin'), postRemoveParent)
    .delete('/delete-student', jwtValidation, checkPermission('Admin'), postRemoveStudent);


export default adminRouter;
