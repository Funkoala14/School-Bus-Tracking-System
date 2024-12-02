import { Router } from 'express';
import { deleteRoute, deleteStop, getAllRoutes, postAddRoute, postAddStop, postAssignBus, postRemoveBus, postUpdateRouteInfo, postUpdateStop, postUpdateStops } from '../controllers/RouteController.js';
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
    .post('/update-stops', jwtValidation, stopsValidation, postUpdateStops)
    .post('/update-stop', jwtValidation, postUpdateStop)
    .post('/delete-stop', jwtValidation, deleteStop)
    .post('/update', jwtValidation, postUpdateRouteInfo);

export default routeRouter;
