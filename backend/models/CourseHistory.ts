// models/CourseHistory.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICourseHistory extends Document {
  userId: mongoose.Types.ObjectId;
  courseName: string;
  semester: string;
  grade: string;
  year: number;
}

const CourseHistorySchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseName: { type: String, required: true },
    semester: { type: String, required: true },
    grade: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

const CourseHistory = mongoose.model<ICourseHistory>('CourseHistory', CourseHistorySchema);

export default CourseHistory;

