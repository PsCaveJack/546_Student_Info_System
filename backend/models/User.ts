import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourseHistory {
  courseCode: string;
  grade: string;
  credits: number;
  sectionId: mongoose.Types.ObjectId;
}

export interface IScheduleEntry {
  sectionId: mongoose.Types.ObjectId;
}

export interface IUser extends Document {
  username: string;
  password: string;
  role: 'student' | 'professor' | 'admin';
  firstName?: string;
  lastName?: string;
  email?: string;
  major?: string;
  schedule?: IScheduleEntry[];
  history?: ICourseHistory[];
  unitsCompleted?: number;
  gradeLevel?: string;
  GPA?: number;
  coursesTaught?: IScheduleEntry[];
  graduationStatus?: 'Not Eligible' | 'Eligible' | 'Approved';
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'professor', 'admin'], required: true },
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },

    major: { type: String },

    schedule: [{ sectionId: { type: Schema.Types.ObjectId, ref: 'Section' } }],
    history: [
      {
        sectionId:   { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        courseCode: String,
        grade: String,
        credits: Number
      }
    ],
    unitsCompleted: Number,
    gradeLevel: String,
    GPA: Number,
    coursesTaught: [{ sectionId: { type: Schema.Types.ObjectId, ref: 'Section' } }],

    graduationStatus: {
      type: String,
      enum: ['Not Eligible', 'Eligible', 'Approved'],
      default: 'Not Eligible'
    }
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;