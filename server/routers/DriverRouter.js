import { Router } from 'express';
import { getDriverInfo, postUpdateDriverProfile } from '../controllers/DriverController.js';
import { checkPermission, jwtValidation } from '../middleware/AuthMiddleware.js';

const driverRouter = Router();

driverRouter
    .get('/info', jwtValidation, checkPermission('Driver'), getDriverInfo)
    .post('/update', jwtValidation, checkPermission('Driver'), postUpdateDriverProfile);

export default driverRouter;
