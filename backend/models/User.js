const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'professor', 'admin'], required: true },
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },

  // Student fields
  schedule: [{ sectionId: mongoose.Schema.Types.ObjectId }],
  history: [{
    courseCode: String,
    grade: String,
    credits: Number
  }],
  unitsCompleted: Number,
  gradeLevel: String,
  GPA: Number,

  // Professor field
  coursesTaught: [{ sectionId: mongoose.Schema.Types.ObjectId }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
