import { model, Schema } from 'mongoose';

const options = { discriminatorKey: 'role', timestamps: true };

const UserSchema = new Schema(
    {
        userName: { type: String, unique: true, required: true, lowercase: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, unique: true, required: true },
        email: { type: String, unique: true, required: true, lowercase: true },
    },
    options
);

const User = model('User', UserSchema);

export default User;
