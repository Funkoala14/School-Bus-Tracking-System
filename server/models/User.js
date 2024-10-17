import { model, Schema } from 'mongoose';

const options = { discriminatorKey: 'role', timestamps: true };
const refType = Schema.Types.ObjectId;

const UserSchema = new Schema(
    {
        userName: { type: String, unique: true, required: true, lowercase: true, trim: true },
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, unique: true, required: true, lowercase: true, trim: true },
        password: { type: String, required: true, trim: true },
        school: { type: refType, ref: 'School', required: true },
    },
    options
);

const User = model('User', UserSchema);

export default User;
