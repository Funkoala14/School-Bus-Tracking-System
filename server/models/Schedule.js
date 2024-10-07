import { model, Schema } from 'mongoose';
import Route from './Route.js';
import Bus from './Bus.js';
import Driver from './Driver.js';
import Stop from './Stop.js';

const refType = Schema.Types.ObjectId;
const stopTimeSchema = new Schema(
    {
        stop: { type: refType, ref: 'Stop', required: true },
        estimatedArrivalTime: {
            type: String, // "08:30 AM"
            required: true,
        },
    },
    { _id: false }
);

const ScheduleSchema = new Schema(
    {
        route: { type: refType, ref: 'Route', required: true },
        bus: { type: refType, ref: 'Bus', required: true },
        driver: { type: refType, ref: 'Driver', required: true },
        startTime: { type: Date, required: true },
        stopTimes: [stopTimeSchema],
    },
    { timestamps: true }
);

const Schedule = model('Schedule', ScheduleSchema);
export default Schedule;
