import { Router } from 'express';
import { addBusValidation } from '../middleware/ValidationMiddleware.js';
import { jwtValidation } from '../middleware/AuthMiddleware.js';
import { deleteBus, postAddBus, postAssignBusDriver } from '../controllers/BusController.js';

const busRouter = Router();

busRouter
    .post('/add', addBusValidation, jwtValidation, postAddBus)
    .delete('/delete', jwtValidation, deleteBus)
    .post('/assign-driver', postAssignBusDriver);

export default busRouter;
