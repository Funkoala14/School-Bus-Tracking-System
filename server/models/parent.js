const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    parent_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    address: { type: String },
    email: { type: String, unique: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
