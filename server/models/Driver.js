import { Schema } from 'mongoose';
import User from './User.js';
import Bus from './Bus.js';

const refType = Schema.Types.ObjectId;

const DriverSchema = new Schema({
    liscense: { type: String, required: true, unique: true, trim: true },
    liscenseExpiry: { type: Date, required: true },
    assignedBus: { type: refType, ref: 'Bus' },
});

const Driver = User.discriminator('Driver', DriverSchema);

export default Driver;
