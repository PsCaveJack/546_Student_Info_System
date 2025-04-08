import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRegistration extends Document {
  studentId: mongoose.Types.ObjectId;
  sectionId: mongoose.Types.ObjectId;
  registrationDate?: Date;
  status: 'enrolled' | 'completed' | 'dropped';
  grade?: string | null;
  dropDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const registrationSchema: Schema<IRegistration> = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['enrolled', 'completed', 'dropped'], required: true },
    grade: { type: String, default: null },
    dropDate: { type: Date, default: null }
  },
  { timestamps: true }
);

const Registration: Model<IRegistration> = mongoose.model<IRegistration>('Registration', registrationSchema);
export default Registration;

