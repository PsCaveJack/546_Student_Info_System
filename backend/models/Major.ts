import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMajor extends Document {
  majorName: string;
  requiredCourses: string[];
  electives: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const majorSchema: Schema<IMajor> = new Schema(
  {
    majorName: { type: String, required: true, unique: true },
    requiredCourses: { type: [String], default: [] },
    electives: { type: [String], default: [] }
  },
  { timestamps: true }
);

const Major: Model<IMajor> = mongoose.model<IMajor>('Major', majorSchema);
export default Major;

