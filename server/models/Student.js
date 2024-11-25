import { Schema, model } from 'mongoose';
import Address from './Address.js';
import Parent from './Parent.js';
import Route from './Route.js';
import School from './School.js';
import Stop from './Stop.js';

const refType = Schema.Types.ObjectId;
const studentSchema = new Schema(
    {
        studentId: { type: String, required: true, unique: true, trim: true },
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        school: { type: refType, ref: 'School' },
        parent: { type: refType, ref: 'Parent' },
        route: [{ type: refType, ref: 'Route' }],
        stop: { type: refType, ref: 'Stop' },
        address: { type: refType, ref: 'Address' },
    },
    { timestamps: true }
);

const Student = model('Student', studentSchema);

export default Student;
