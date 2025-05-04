export interface Course {
  courseCode: string;
  courseName: string;
  description?: string;
  prerequisites: string[];
  units: number;
  department: string;
  createdAt?: Date;
  updatedAt?: Date;

  _id: string;
}