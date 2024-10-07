import { model, Schema } from 'mongoose';
import Address from './Address.js';

const refType = Schema.Types.ObjectId;

const StopSchema = new Schema(
    {
        location: { type: refType, ref: 'Address' },
        order: { type: Number, required: true },
    },
    { timestamps: true }
);

const Stop = model('Stop', StopSchema);

export default Stop;
