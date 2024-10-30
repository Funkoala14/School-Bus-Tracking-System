import { model, Schema } from 'mongoose';
import Driver from './Driver.js';
import School from './School.js';
import Route from './Route.js';

const refType = Schema.Types.ObjectId;
const BusSchema = new Schema(
    {
        plate: { type: String, unique: true, required: true },
        capacity: { type: Number, required: true },
        year: { type: Number, min: 1900, max: new Date().getFullYear() },
        assignedDriver: { type: refType, ref: 'Driver' },
        assignedRoutes: [{ type: refType, ref: 'Route' }],
        school: { type: refType, ref: 'School' },
    },
    { timestamps: true }
);

const Bus = model('Bus', BusSchema);

export default Bus;
