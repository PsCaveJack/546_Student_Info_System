'use client';
import React, { useState, useEffect } from 'react';


interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  major: string;
  enrolledCourses: Array<{
    sectionId: string;
    courseCode: string;
    section: string;
    semester: string;
  }>;
}

export const ProfessorStudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [enrollmentHistory, setEnrollmentHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the API base URL from environment variable
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE
  
  // Get professor ID - use the actual ID from your database
  const professorId = '67f3888bcfae5e70ec67198a'; // Replace with your actual professor ID

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const url = `${API_BASE}/professor/${professorId}/students`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      const text = await response.text();
      console.log('Raw response:', text);
      
      const data = JSON.parse(text);
      console.log('Parsed data:', data);
      
      setStudents(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  const fetchStudentHistory = async (studentId: string) => {
    try {
      const response = await fetch(`${API_BASE}/professor/${professorId}/student/${studentId}/history`);
      if (!response.ok) throw new Error('Failed to fetch student history');
      const data = await response.json();
      setEnrollmentHistory(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    fetchStudentHistory(student._id);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      <h1 style={{
        color: '#1e3a8a',
        fontSize: '28px',
        marginBottom: '24px',
        fontWeight: 600
      }}>My Students</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '24px',
        marginTop: '24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '20px'
        }}>
          <h2 style={{
            color: '#374151',
            fontSize: '20px',
            marginBottom: '16px',
            fontWeight: 600,
            paddingBottom: '8px',
            borderBottom: '2px solid #e5e7eb'
          }}>Students</h2>
          {students.map(student => (
            <div
              key={student._id}
              style={{
                background: selectedStudent?._id === student._id ? '#dbeafe' : '#f9fafb',
                border: `1px solid ${selectedStudent?._id === student._id ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleStudentClick(student)}
            >
              <h3 style={{
                color: '#111827',
                fontSize: '18px',
                marginBottom: '8px',
                fontWeight: 600
              }}>{student.firstName} {student.lastName}</h3>
              <p style={{
                color: '#4b5563',
                margin: '6px 0',
                fontSize: '14px'
              }}>Major: {student.major}</p>
              <p style={{
                color: '#4b5563',
                margin: '6px 0',
                fontSize: '14px'
              }}>Email: {student.email}</p>
            </div>
          ))}
        </div>
        
        {selectedStudent && enrollmentHistory && (
          <div style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px'
          }}>
            <h2 style={{
              color: '#374151',
              fontSize: '22px',
              marginBottom: '24px',
              fontWeight: 600,
              paddingBottom: '12px',
              borderBottom: '2px solid #e5e7eb'
            }}>{selectedStudent.firstName} {selectedStudent.lastName}'s Enrollment History</h2>
            
            <div style={{
              marginTop: '20px'
            }}>
              {Object.keys(enrollmentHistory.enrollmentHistory).map(semester => (
                <div key={semester} style={{
                  marginBottom: '32px'
                }}>
                  <h3 style={{
                    color: '#1f2937',
                    fontSize: '18px',
                    marginBottom: '12px',
                    fontWeight: 600,
                    background: '#f3f4f6',
                    padding: '8px 16px',
                    borderRadius: '4px'
                  }}>{semester}</h3>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '12px',
                    background: 'white',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <thead>
                      <tr>
                        <th style={{
                          background: '#f8fafc',
                          color: '#374151',
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          borderBottom: '2px solid #e5e7eb'
                        }}>Course Code</th>
                        <th style={{
                          background: '#f8fafc',
                          color: '#374151',
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          borderBottom: '2px solid #e5e7eb'
                        }}>Section</th>
                        <th style={{
                          background: '#f8fafc',
                          color: '#374151',
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          borderBottom: '2px solid #e5e7eb'
                        }}>Instructor</th>
                        <th style={{
                          background: '#f8fafc',
                          color: '#374151',
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          borderBottom: '2px solid #e5e7eb'
                        }}>Grade</th>
                        <th style={{
                          background: '#f8fafc',
                          color: '#374151',
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          borderBottom: '2px solid #e5e7eb'
                        }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollmentHistory.enrollmentHistory[semester].map((course: any, index: number) => (
                        <tr key={index}>
                          <td style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#4b5563'
                          }}>{course.courseCode}</td>
                          <td style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#4b5563'
                          }}>{course.section}</td>
                          <td style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#4b5563'
                          }}>{course.instructor}</td>
                          <td style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#4b5563'
                          }}>{course.grade || '-'}</td>
                          <td style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#4b5563'
                          }}>{course.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorStudentList;