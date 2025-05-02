export interface Schedule {
  days: string[];
  time: string;
}

export interface Section {
  courseCode: string;
  section: string;
  semester: string;
  instructor: string;
  schedule: Schedule;
  location?: string;
  capacity?: number;
  enrolledStudents?: string[];
  enrollmentStartDate?: Date;
  enrollmentEndDate?: Date;
  dropDeadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Seasons: string[] = ["Spring", "Summer", "Fall"]

export const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];