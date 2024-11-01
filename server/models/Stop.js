import { model, Schema } from 'mongoose';
import Address from './Address.js';
import Route from './Route.js';

const refType = Schema.Types.ObjectId;

const StopSchema = new Schema(
    {
        name: { type: String, trim: true, required: true },
        location: { type: refType, ref: 'Address' },
        order: { type: Number, required: true },
        stopTime: { type: String },
        route: { type: refType, ref: 'Route', required: true },
        direction: {
            type: String,
            enum: ['inbound', 'outbound'],
            required: true,
        },
    },
    { timestamps: true }
);

const Stop = model('Stop', StopSchema);

export default Stop;
