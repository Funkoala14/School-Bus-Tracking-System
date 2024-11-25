import { model, Schema } from 'mongoose';

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

const LiveLocationSchema = new Schema(
    {
        route: { type: refType, ref: 'Route', required: true, unique: true },
        location: { lat: { type: String, trim: true }, lng: { type: String, trim: true } },
        nextStop: {
            stopName: { type: String, trim: true },
            duration: { type: String, trim: true },
            distance: { type: String, trim: true },
        },
        // remainSchedule: [stopTimeSchema],
    },
    { timestamps: true }
);

const LiveLocation = model('LiveLocation', LiveLocationSchema);
export default LiveLocation;