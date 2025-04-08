import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourseHistory {
  courseCode: string;
  grade: string;
  credits: number;
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
  schedule?: IScheduleEntry[];
  history?: ICourseHistory[];
  unitsCompleted?: number;
  gradeLevel?: string;
  GPA?: number;
  coursesTaught?: IScheduleEntry[];
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
    schedule: [{ sectionId: { type: Schema.Types.ObjectId, ref: 'Section' } }],
    history: [{
      courseCode: String,
      grade: String,
      credits: Number
    }],
    unitsCompleted: Number,
    gradeLevel: String,
    GPA: Number,
    coursesTaught: [{ sectionId: { type: Schema.Types.ObjectId, ref: 'Section' } }]
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;

