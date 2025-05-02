import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

const logRequest = (method: string, url: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 ${method} ${url}`);
  }
};

export const dataFetcher = async (url: string) => {
  logRequest('GET', url);
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`❌ Error fetching data from ${url}:`, error.message);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
     
      if (error.response?.status === 404) {
        throw new Error(`Resource not found: ${url}`);
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Authentication error: You do not have permission to access this resource');
      }
    }
    throw error;
  }
};

// fetcher for student active classes
export const fetchStudentActiveClasses = async (studentId: string) => {
  if (!API_BASE) {
    console.error('❌ Configuration error: NEXT_PUBLIC_API_BASE environment variable is not defined');
    throw new Error('API configuration error: NEXT_PUBLIC_API_BASE is not defined');
  }

  const endpoint = `${API_BASE}/registrations/student/${studentId}/enrolled`;
  logRequest('GET', endpoint);
 
  try {
    const { data } = await axios.get(endpoint);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`❌ Error fetching classes for student ${studentId}:`, error.message);
     
      // Log details for debugging
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else if (error.request) {
        console.error('No response received from server');
      }
      
      if (error.response?.status === 404) {
        throw new Error(`No enrollment data found for student ID: ${studentId}`);
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Authentication error: You do not have permission to access this data');
      }
    }

    throw new Error(`Failed to fetch student classes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};