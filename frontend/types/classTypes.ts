export interface Course {
  courseCode: string;
  courseName: string;
  description?: string;
  prerequisites: string[];
  units: number;
  department: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Schedule {
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