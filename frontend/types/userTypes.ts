export interface ICourseHistory {
  courseCode: string;
  grade: string;
  credits: number;
}

export interface IScheduleEntry {
  sectionId: string;
}

export interface User {
  _id: string;
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