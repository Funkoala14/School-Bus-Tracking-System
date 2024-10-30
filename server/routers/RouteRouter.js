import { Router } from 'express';
import { deleteRoute, getAllRoutes, postAddRoute, postAssignBus, postRemoveBus } from '../controllers/RouteController.js';
import { jwtValidation } from '../middleware/AuthMiddleware.js';
import { addRouteValidation, assignBusValidation } from '../middleware/ValidationMiddleware.js';

const routeRouter = Router();

routeRouter
    .get('/all', jwtValidation, getAllRoutes)
    .post('/add', jwtValidation, addRouteValidation, postAddRoute)
    .post('/delete', jwtValidation, deleteRoute)
    .post('/assign-bus', jwtValidation, assignBusValidation, postAssignBus)
    .post('/remove-bus', jwtValidation, assignBusValidation, postRemoveBus);

export default routeRouter;
