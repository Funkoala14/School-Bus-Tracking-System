import { Router } from 'express';
import { deleteRoute, deleteStop, getAllRoutes, postAddRoute, postAddStop, postAssignBus, postRemoveBus, postUpdateStop } from '../controllers/RouteController.js';
import { jwtValidation } from '../middleware/AuthMiddleware.js';
import { addRouteValidation, addStopValidation, assignBusValidation, stopsValidation } from '../middleware/ValidationMiddleware.js';

const routeRouter = Router();

routeRouter
    .get('/all', jwtValidation, getAllRoutes)
    .post('/add', jwtValidation, addRouteValidation, postAddRoute)
    .post('/delete', jwtValidation, deleteRoute)
    .post('/assign-bus', jwtValidation, assignBusValidation, postAssignBus)
    .post('/remove-bus', jwtValidation, assignBusValidation, postRemoveBus)
    .post('/add-stop', jwtValidation, addStopValidation, postAddStop)
    .post('/update-stops', jwtValidation, stopsValidation, postUpdateStop)
    .post('/delete-stop', jwtValidation, deleteStop)

export default routeRouter;
