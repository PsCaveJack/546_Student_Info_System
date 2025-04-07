const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema({
  majorName: { type: String, required: true, unique: true },
  requiredCourses: [String],
  electives: [String]
}, { timestamps: true });

module.exports = mongoose.model('Major', majorSchema);
