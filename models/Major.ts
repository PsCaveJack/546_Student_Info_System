// models/Major.ts
import mongoose, { Schema, model, models } from 'mongoose';

const majorSchema = new Schema({
  name: String,
  requiredClasses: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
});

export const Major = models.Major || model('Major', majorSchema);