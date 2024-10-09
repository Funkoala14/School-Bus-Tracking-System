import { Schema, model } from 'mongoose';

const AddressSchema = new Schema(
    {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipcode: { type: String, required: true, trim: true },
        address: { type: String, trim: true },
        coordinates: {
            lat: { type: String, required: true },
            long: { type: String, required: true },
        },
    },
    { timestamps: true }
);

const Address = model('Address', AddressSchema);

export default Address;
