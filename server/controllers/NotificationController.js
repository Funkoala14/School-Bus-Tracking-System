import { sendSMS } from "../utils/twilio.js";

export const sendArrivalNotification = (req, res) => {
    try {
        const to = "+17746969617";
        const message ="test twilio"
        sendSMS(to, message);
        return res.status(200).json({ message: 'Notification sent successfully', code: 200 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
}