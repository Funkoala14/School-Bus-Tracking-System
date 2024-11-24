import { updateLiveTimeRoute } from './RouteScheduleController.js';

export default (io) => {
    io.on('connection', (socket) => {
        console.log('A client connected:', socket.id);

        // // Set a timeout to automatically disconnect the client after 60 seconds of inactivity
        // let inactivityTimeout = setTimeout(() => {
        //     console.log(`No updates received from driver ${socket.id}, disconnecting...`);
        //     socket.disconnect();
        // }, 60000); // 60 seconds

        // Listen for driver's live location updates
        socket.on('driverLocation', (data) => {
            const { driverId, lat, lng, direction } = data;
            console.log(`Received location for driver ${driverId}: ${direction}: ${lat}, ${lng}`);
            updateLiveTimeRoute({ driverId, direction, lat, lng, socket });

            // // Reset the inactivity timeout
            // clearTimeout(inactivityTimeout);
            // inactivityTimeout = setTimeout(() => {
            //     console.log(`No updates received from driver ${driverId}, disconnecting...`);
            //     socket.disconnect();
            // }, 60000); // Reset timeout

            // Broadcast the location update to all connected clients
            io.emit(`locationUpdate:${driverId}`, { lat, lng });
        });

        // Handle custom disconnect request from the frontend
        socket.on('disconnectRequest', () => {
            console.log('Client requested disconnect:', socket.id);
            socket.disconnect();
        });

        // Handle client disconnect (frontend disconnection)
        socket.on('disconnect', () => {
            console.log('A client disconnected:', socket.id);
            // Optionally, clear the inactivity timeout if it wasn't already cleared
            // clearTimeout(inactivityTimeout);
        });
    });
};
