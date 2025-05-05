import axios from "axios";
import { Course } from "@/types/classTypes";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

const logRequest = (method: string, url: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 ${method} ${url}`);
  }
};

export const fetchCourses = async (
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>
) => {
  const url = `${API_BASE}/courses`;
  logRequest('GET', url);
  
  try {
    const { data } = await axios.get(url);
    setCourses(data);
  } catch (error) {
    console.error("❌ fetchCourses error:", error);
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
    }
    throw error;
  }
};

export const dropClass = async (registrationId: string) => {
  const url = `${API_BASE}/registrations/${registrationId}/drop`;
  logRequest('PUT', url);
  
  try {
    const { data } = await axios.put(url);
    return data;
  } catch (error) {
    console.error("❌ dropClass error:", error);
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      
      if (error.response?.status === 404) {
        throw new Error(`Registration with ID ${registrationId} not found`);
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Authentication error: You do not have permission to drop this class');
      }
    }
    throw new Error(`Failed to drop class: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};