const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  section: { type: String, required: true },
  semester: { type: String, required: true },
  instructor: { type: String, required: true }, // Could later link to a User _id with role 'professor'

  schedule: {
    days: [String],
    time: String
  },

  location: String,
  capacity: Number,
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  enrollmentStartDate: Date,
  enrollmentEndDate: Date,
  dropDeadline: Date

}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);
