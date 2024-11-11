import twilio from 'twilio';
import config from '../config/config.js';

const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

// Function to send an SMS
export const sendSMS = async (to, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: config.TWILIO_PHONE_NUMBER, // your Twilio phone number
            to, // recipient's phone number
        });
        console.log('Message sent:', response.sid);
    } catch (error) {
        console.error('Error sending message:', error);
        throw new Error(error.message);
    }
};

// Usage
// sendSMS('+17746969617', 'Hello from Twilio and Node.js!');
