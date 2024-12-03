import { Router } from 'express';
import { addBusValidation, assignDriverValidation } from '../middleware/ValidationMiddleware.js';
import { jwtValidation } from '../middleware/AuthMiddleware.js';
import { deleteBus, getAllBuses, postAddBus, postAssignBusDriver, postUpdateBus } from '../controllers/BusController.js';

const busRouter = Router();

busRouter
    .get('/all', jwtValidation, getAllBuses)
    .post('/add', addBusValidation, jwtValidation, postAddBus)
    .delete('/delete', jwtValidation, deleteBus)
    .post('/assign-driver',jwtValidation, assignDriverValidation, postAssignBusDriver)
    .post('/update',jwtValidation, postUpdateBus);

export default busRouter;
