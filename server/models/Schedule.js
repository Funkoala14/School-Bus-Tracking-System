import { model, Schema } from 'mongoose';
import Route from './Route.js';
import Bus from './Bus.js';
import Driver from './Driver.js';
import Stop from './Stop.js';

const refType = Schema.Types.ObjectId;
const stopTimeSchema = new Schema(
    {
        stop: { type: refType, ref: 'Stop', required: true },
        arrivalTime: {
            type: String, // "08:30 AM"
            required: true,
        },
    },
    { _id: false }
);

const ScheduleSchema = new Schema(
    {
        route: { type: refType, ref: 'Route', required: true },
        startTime: { type: String, required: true },
        stopTimes: [stopTimeSchema],
    },
    { timestamps: true }
);

const Schedule = model('Schedule', ScheduleSchema);
export default Schedule;
