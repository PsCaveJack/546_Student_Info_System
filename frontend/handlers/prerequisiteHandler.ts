import axios from 'axios';
import { Course } from '../types/classTypes';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export const checkPrerequisites = async (
  courseCode: string,
  completedCourses: string[]
): Promise<boolean> => {
  try {
    const response = await axios.get<Course>(`${API_BASE}/courses/${courseCode}`);
    const course = response.data;

    if (!course.prerequisites || course.prerequisites.length === 0) {
      return true; // No prerequisites
    }

    const unmet = course.prerequisites.filter(
      prereq => !completedCourses.includes(prereq)
    );

    return unmet.length === 0;
  } catch (error) {
    console.error(`Error checking prerequisites for ${courseCode}:`, error);
    return false;
  }
};