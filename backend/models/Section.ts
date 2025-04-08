import mongoose, { Schema, Document, Model } from 'mongoose';

interface ISchedule {
  days: string[];
  time: string;
}

export interface ISection extends Document {
  courseCode: string;
  section: string;
  semester: string;
  instructor: string;
  schedule: ISchedule;
  location?: string;
  capacity?: number;
  enrolledStudents?: mongoose.Types.ObjectId[];
  enrollmentStartDate?: Date;
  enrollmentEndDate?: Date;
  dropDeadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const sectionSchema: Schema<ISection> = new Schema(
  {
    courseCode: { type: String, required: true },
    section: { type: String, required: true },
    semester: { type: String, required: true },
    instructor: { type: String, required: true },
    schedule: {
      days: [{ type: String }],
      time: String
    },
    location: String,
    capacity: Number,
    enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    enrollmentStartDate: Date,
    enrollmentEndDate: Date,
    dropDeadline: Date
  },
  { timestamps: true }
);

const Section: Model<ISection> = mongoose.model<ISection>('Section', sectionSchema);
export default Section;
