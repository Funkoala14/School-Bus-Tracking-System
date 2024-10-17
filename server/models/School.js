import { model, Schema } from 'mongoose';
import Address from './Address.js';
import Admin from './Admin.js';
import Bus from './Bus.js';
import Route from './Route.js';
import Parent from './Parent.js';

const refType = Schema.Types.ObjectId;

const SchoolSchema = new Schema(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, unique: true, required: true, trim: true },
        address: { type: refType, ref: 'Address', required: true },
        contactInfo: {
            email: { type: String, trim: true, lowercase: true },
            numbers: { type: String, trim: true },
            website: { type: String, trim: true },
        },
        buses: [{ type: refType, ref: 'Bus' }],
        routes: [{ type: refType, ref: 'Route' }],
        admins: [{ type: refType, ref: 'Admin' }],
        drivers: [{ type: refType, ref: 'Driver' }],
        parents: [{ type: refType, ref: 'Parent' }],
    },
    { timestamps: true }
);

const School = model('School', SchoolSchema);

export default School;
