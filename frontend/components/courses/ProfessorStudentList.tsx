'use client';
import { userAtom } from '@/storage/user';
import { useAtom } from 'jotai';
import React, { useState, useEffect } from 'react';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  major: string;
}

interface EnrollmentRecord {
  courseCode: string;
  courseName?: string;
  grade: string | null;
  status: string;
  credits?: number;
  registrationId: string;
}

interface EnrollmentHistory {
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    major: string;
    GPA: number;
  };
  enrollmentHistory: {
    [semester: string]: EnrollmentRecord[];
  };
}

export const ProfessorStudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [enrollmentHistory, setEnrollmentHistory] = useState<EnrollmentHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Add states for drop functionality
  const [showDropConfirmation, setShowDropConfirmation] = useState(false);
  const [dropData, setDropData] = useState<{registrationId: string, courseCode: string, semester: string} | null>(null);
  const [dropping, setDropping] = useState(false);
  
  const [user, setUser] = useAtom(userAtom);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const professorId = (user) ? user._id : "";

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE}/professor/${professorId}/students`);
      const data = await response.json();
      setStudents(data);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to fetch students');
      setLoading(false);
    }
  };

  const fetchStudentHistory = async (studentId: string) => {
    setLoadingHistory(true);
    try {
      const response = await fetch(`${API_BASE}/registrations/professor/${professorId}/student/${studentId}/history`);
      const data = await response.json();
      setEnrollmentHistory(data);
    } catch (err: any) {
      setError('Failed to fetch student history');
      setEnrollmentHistory(null);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    fetchStudentHistory(student._id);
  };

  // Add drop functionality methods
  const handleDropClick = (registrationId: string, courseCode: string, semester: string) => {
    setDropData({ registrationId, courseCode, semester });
    setShowDropConfirmation(true);
  };

  const confirmDrop = async () => {
    if (!dropData) return;
    
    setDropping(true);
    try {
      const response = await fetch(`${API_BASE}/registrations/${dropData.registrationId}/drop`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to drop student');
      }
      
      if (selectedStudent) {
        fetchStudentHistory(selectedStudent._id);
      }

      fetchStudents();
      
    } catch (err: any) {
      setError(`Failed to drop student: ${err.message}`);
    } finally {
      setDropping(false);
      setShowDropConfirmation(false);
      setDropData(null);
    }
  };

  const cancelDrop = () => {
    setShowDropConfirmation(false);
    setDropData(null);
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
        
        {selectedStudent && (
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
            }}>{selectedStudent.firstName} {selectedStudent.lastName}'s Enrollment Records</h2>
            
            {loadingHistory ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              </div>
            ) : enrollmentHistory && enrollmentHistory.enrollmentHistory ? (
              <div>
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
                          }}>Course Name</th>
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
                          {/* Add Action column */}
                          <th style={{
                            background: '#f8fafc',
                            color: '#374151',
                            padding: '12px 16px',
                            textAlign: 'center',
                            fontWeight: 600,
                            borderBottom: '2px solid #e5e7eb'
                          }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollmentHistory.enrollmentHistory[semester].map((course: EnrollmentRecord, index: number) => (
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
                            }}>{course.grade || '-'}</td>
                            <td style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid #e5e7eb',
                              color: '#4b5563'
                            }}>{course.status}</td>
                            {/* Add Drop button for enrolled courses */}
                            <td style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid #e5e7eb',
                              textAlign: 'center'
                            }}>
                              {course.status === 'enrolled' && course.registrationId && (
                                <button
                                  onClick={() => handleDropClick(course.registrationId, course.courseCode, semester)}
                                  style={{
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '6px 12px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                  }}
                                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                                >
                                  Drop
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '32px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  color: '#374151',
                  marginBottom: '8px'
                }}>No enrollment history</h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '14px'
                }}>This student has no enrollment records to display.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Drop Confirmation Modal */}
      {showDropConfirmation && dropData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '400px',
            maxWidth: '90%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              color: '#111827',
              fontSize: '20px',
              marginBottom: '16px',
              fontWeight: 600
            }}>Confirm Drop</h3>
            
            <p style={{
              color: '#4b5563',
              marginBottom: '24px'
            }}>
              Are you sure you want to drop {selectedStudent?.firstName} {selectedStudent?.lastName} from {dropData.courseCode} ({dropData.semester})?
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={cancelDrop}
                disabled={dropping}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: dropping ? 'not-allowed' : 'pointer',
                  opacity: dropping ? 0.7 : 1
                }}
              >
                Cancel
              </button>
              
              <button
                onClick={confirmDrop}
                disabled={dropping}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: dropping ? 'not-allowed' : 'pointer',
                  opacity: dropping ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {dropping ? (
                  <>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #f3f4f6',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }}></span>
                    Dropping...
                  </>
                ) : 'Confirm Drop'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfessorStudentList;