import { Schema } from 'mongoose';
import User from './User.js';
import Bus from './Bus.js';
import School from './School.js';

const refType = Schema.Types.ObjectId;

const DriverSchema = new Schema({
    license: { type: String,  unique: true, trim: true },
    licenseExpiry: { type: Date},
    assignedBus: { type: refType, ref: 'Bus' },
});

const Driver = User.discriminator('Driver', DriverSchema);

export default Driver;
