const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    parent_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    address: {
        address: { type: String, default: null }, // 人类可读地址
        lat: { type: Number, default: null }, // 纬度
        long: { type: Number, default: null }, // 经度
    },
    email: { type: String, unique: true },
    route: { type: String, default: null }, // 存储路线的 ID
    stop: { type: String, default: null }, // 存储停靠点的 ID
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'student' }],
});

const Parent = mongoose.model('parent', parentSchema);

module.exports = Parent;
