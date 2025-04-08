import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourse extends Document {
  courseCode: string;
  courseName: string;
  description?: string;
  prerequisites: string[];
  units: number;
  department: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const courseSchema: Schema<ICourse> = new Schema(
  {
    courseCode: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    description: { type: String },
    prerequisites: { type: [String], default: [] },
    units: { type: Number, required: true },
    department: { type: String, required: true }
  },
  { timestamps: true }
);

const Course: Model<ICourse> = mongoose.model<ICourse>('Course', courseSchema);
export default Course;

