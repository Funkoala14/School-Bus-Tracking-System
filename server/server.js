import app from './app.js';
import connection from './config/connection.js';
import config from './config/config.js';
import { createServer } from "http";
import { Server } from "socket.io";
import { updateLiveTimeRoute } from './controllers/RouteScheduleController.js';
import wsController from './controllers/wsController.js';

// HTTP server to use with Socket.IO
const server = createServer(app);

// Initialize Socket.IO on the server
const io = new Server(server, {
    cors: {
        origin: config.FRONT_URL, // Adjust this to match your frontend's origin
        methods: ['GET', 'POST'],
    },
});

// WebSocket connection and event listeners
wsController(io);

connection.once('open', () => {
    console.log('MongoDB connected successfully');

    server.listen(config.PORT || 5000, () => {
        console.log(`API server running on http://localhost:${config.PORT}`);
    });
});
