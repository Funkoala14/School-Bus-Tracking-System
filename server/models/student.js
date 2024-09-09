const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    student_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
