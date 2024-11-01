import { Schema } from 'mongoose';
import Student from './Student.js';
import Address from './Address.js';
import User from './User.js';

const refType = Schema.Types.ObjectId;

const ParantSchema = new Schema(
    {
        address: { type: refType, ref: 'Address' },
        children: [{ type: refType, ref: 'Student' }],
    },
    { timestamps: true }
);

const Parent = User.discriminator('Parent', ParantSchema);

export default Parent;
