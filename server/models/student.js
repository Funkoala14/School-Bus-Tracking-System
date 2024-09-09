const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    student_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'parent' },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'route' },
    address: {
        address: { type: String, default: null }, // 人类可读地址
        lat: { type: Number, default: null }, // 纬度
        long: { type: Number, default: null }, // 经度
    },
});

const Student = mongoose.model('student', studentSchema);

module.exports = Student;
