import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import { sendSMS } from '../utils/twilio.js';

export const sendArrivalNotification = (req, res) => {
    try {
        const to = '+17746969617';
        const message = 'test twilio';
        sendSMS(to, message);
        return res.status(200).json({ message: 'Notification sent successfully', code: 200 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const updateLiveTimeRoute = async (data) => {
    const { driverId, lat, long } = data;
    try {
        const bus = await Bus.findOne({ assignedDriver: driverId }).populate('school');
        // Get the current time
        const currentTime = new Date();
        const hour = currentTime.getHours();

        const isInbound = hour < 12;

        const route = await Route.findOne({ assignedBus: bus._id, direction: isInbound ? 'inBound' : 'outBound' });
    } catch (error) {
        console.error(`Error updating location for driver ${driverId}:`, error);
    }
};
