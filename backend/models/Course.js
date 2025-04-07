const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  description: { type: String },
  prerequisites: [String],
  units: { type: Number, required: true },
  department: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
