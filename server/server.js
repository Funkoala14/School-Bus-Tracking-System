import app from './app.js';
import connection from './config/connection.js';
import config from './config/config.js';
import { createServer } from "http";
import { Server } from "socket.io";

// HTTP server to use with Socket.IO
const server = createServer(app);

// Initialize Socket.IO on the server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5000', // Adjust this to match your frontend's origin
        methods: ['GET', 'POST'],
    },
});


connection.once('open', () => {
    console.log('MongoDB connected successfully');

    server.listen(config.PORT, () => {
        console.log(`API server running on http://localhost:${config.PORT}`);
    });
});


// WebSocket connection and event listeners
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Listen for driver's live location updates
    socket.on('driverLocation', (data) => {
        const { driverId, latitude, longitude } = data;
        console.log(`Received location for driver ${driverId}: ${latitude}, ${longitude}`);

        // Broadcast the location update to all connected clients
        io.emit(`locationUpdate:${driverId}`, { latitude, longitude });
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('A client disconnected:', socket.id);
    });
});