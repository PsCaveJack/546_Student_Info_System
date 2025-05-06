export interface Section {
    _id: string;
    courseCode: string;
    section: string;
    semester: string;
    instructor: string;
    schedule: {
      days: string[];
      time: string;
    };
    location?: string;
    capacity?: number;
    enrolledStudents?: string[];    
    enrollmentStartDate?: string;    
    enrollmentEndDate?: string;
    dropDeadline?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  