// models/User.ts
import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'student',
  },
}, { timestamps: true });

export const User = models.User || model('User', userSchema);