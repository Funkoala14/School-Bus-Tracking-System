import { model, Schema } from 'mongoose';
import Stop from './Stop.js';
import School from './School.js';

const refType = Schema.Types.ObjectId;

const RouteSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        direction: {
            type: String,
            enum: ['inbound', 'outbound'],
            required: true,
        },
        stops: [{ type: refType, ref: 'Stop' }],
        school: { type: refType, ref: 'School' },
    },
    { timestamps: true }
);

const Route = model('Route', RouteSchema);

export default Route;