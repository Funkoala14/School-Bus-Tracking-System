import { Schema, model } from 'mongoose';

const AddressSchema = new Schema(
    {
        buildingOrAptNum: { type: String, trim: true },
        street: { type: String, trim: true, required: true },
        city: { type: String, trim: true, required: true },
        state: { type: String, trim: true, required: true },
        zipcode: { type: String, required: true, trim: true },
        address: { type: String, trim: true },
        coordinates: {
            lat: { type: String, required: true },
            lng: { type: String, required: true },
        },
    },
    { timestamps: true }
);

const Address = model('Address', AddressSchema);

export default Address;
