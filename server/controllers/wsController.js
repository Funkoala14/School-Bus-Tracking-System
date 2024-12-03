import Bus from '../models/Bus.js';
import LiveLocation from '../models/LiveLocation.js';
import Route from '../models/Route.js';

const updateLiveLocation = async (liveLocation, lat, lng, nextStop) => {
    liveLocation.set({
        lat,
        lng,
        nextStop: {
            stopName: nextStop?.stopName || liveLocation.nextStop?.stopName,
            duration: nextStop?.duration?.text || liveLocation.nextStop?.duration,
            distance: nextStop?.distance?.text || liveLocation.nextStop?.distance,
        },
    });
    await liveLocation.save();
};

const createLiveLocation = async (routeId, lat, lng, nextStop) => {
    return LiveLocation.create({
        route: routeId,
        location: { lat, lng },
        nextStop: {
            stopName: nextStop?.stopName || '',
            duration: nextStop?.duration?.text || '',
            distance: nextStop?.distance?.text || '',
        },
    });
};

export default (io) => {
    io.on('connection', (socket) => {
        console.log('A client connected:', socket.id);

        // // Set a timeout to automatically disconnect the client after 60 seconds of inactivity
        // let inactivityTimeout = setTimeout(() => {
        //     console.log(`No updates received from driver ${socket.id}, disconnecting...`);
        //     socket.disconnect();
        // }, 60000); // 60 seconds

        // Listen for driver's live location updates
        socket.on('driverLocation', async (data) => {
            const { driverId, lat, lng, direction, nextStop } = data;
            console.log(`Received location for driver ${driverId}: ${lat}, ${lng} nextStop ${nextStop}`);
            try {
                const bus = await Bus.findOne({ assignedDriver: driverId }).populate('school');
                if (!bus) {
                    throw new Error(`No bus found for driver ${driverId}`);
                }
                const route = await Route.findOne({ assignedBus: bus._id, direction });
                if (!route) {
                    throw new Error(`No route found for bus ${bus._id} with direction ${direction}`);
                }
                let liveLocation = await LiveLocation.findOne({ route: route._id });

                // LiveLocation
                if (liveLocation) {
                    await updateLiveLocation(liveLocation, lat, lng, nextStop);
                } else {
                    await createLiveLocation(route._id, lat, lng, nextStop);
                }
                
            } catch (error) {
                console.error(`Error handling location for driver ${driverId}:`, error);
                socket.emit('serverReply', { message: `Error updating location for driver ${driverId}` });
                return;
            }

            // Broadcast the location update to all connected clients
            socket.emit(`locationUpdate: success`);
        });

        socket.on('driverStop', async (data) => {
            const { driverId, direction } = data;
            try {
                const bus = await Bus.findOne({ assignedDriver: driverId }).populate('school');
                if (!bus) {
                    throw new Error(`No bus found for driver ${driverId}`);
                }
                const route = await Route.findOne({ assignedBus: bus._id, direction });
                if (!route) {
                    throw new Error(`No route found for bus ${bus._id} with direction ${direction}`);
                }
                await LiveLocation.findOneAndDelete({ route: route._id });
            } catch (error) {
                console.error(`Error handling location for driver ${driverId}:`, error);
                socket.emit('serverReply', { message: `Error updating location for driver ${driverId}` });
                return;
            }

            // Broadcast the location update to all connected clients
            socket.emit(`live location cleaned: success`);
        });

        socket.on('parentTracking', async (data) => {
            const { parentId, routeId } = data;
            console.log('parentTracking parentId', parentId, ', routeId', routeId);

            try {
                let liveLocation = await LiveLocation.findOne({ route: routeId });
                console.log(liveLocation);

                socket.emit(`busLocation`, liveLocation);

                const changeStream = LiveLocation.watch([{ $match: { 'fullDocument.route': routeId } }]);
                changeStream.on('change', (change) => {
                    console.log('LiveLocation change detected:', change);
                    // Send updated live location to the client
                    socket.emit('busLocation', change.fullDocument);
                });
            } catch (error) {
                console.error(`Error handling tracking location for parent ${parentId}:`, error);
                socket.emit('serverReply', { message: `Error handling tracking location for parent ${parentId}` });
                return;
            }
        });

        // Handle custom disconnect request from the frontend
        socket.on('disconnectRequest', () => {
            console.log('Client requested disconnect:', socket.id);
            socket.disconnect();
        });

        // Handle client disconnect (frontend disconnection)
        socket.on('disconnect', () => {
            console.log('A client disconnected:', socket.id);
        });
    });
};
