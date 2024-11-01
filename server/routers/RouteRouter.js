import { Router } from 'express';
import { deleteRoute, getAllRoutes, postAddRoute, postAddStop, postAssignBus, postRemoveBus } from '../controllers/RouteController.js';
import { jwtValidation } from '../middleware/AuthMiddleware.js';
import { addRouteValidation, addStopValidation, assignBusValidation } from '../middleware/ValidationMiddleware.js';

const routeRouter = Router();

routeRouter
    .get('/all', jwtValidation, getAllRoutes)
    .post('/add', jwtValidation, addRouteValidation, postAddRoute)
    .post('/delete', jwtValidation, deleteRoute)
    .post('/assign-bus', jwtValidation, assignBusValidation, postAssignBus)
    .post('/remove-bus', jwtValidation, assignBusValidation, postRemoveBus)
    .post('/add-stop', jwtValidation, addStopValidation, postAddStop);

export default routeRouter;
