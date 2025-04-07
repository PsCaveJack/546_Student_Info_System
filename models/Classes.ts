// models/Class.ts
import mongoose, { Schema, model, models } from 'mongoose';

const classSchema = new Schema({
  code: String,
  name: String,
  semester: String,
  units: Number,
});

export const Class = models.Class || model('Class', classSchema);