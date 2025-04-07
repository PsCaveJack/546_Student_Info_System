const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['enrolled', 'completed', 'dropped'], required: true },
  grade: { type: String, default: null },
  dropDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
