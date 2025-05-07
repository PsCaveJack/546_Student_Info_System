// app/professor/course/[courseId]/students/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Student {
    _id: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    username?: string;
    grade: string | null;
    registrationId: string;
  }

interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
  description: string;
}

export default function CourseStudentList() {
  // Use useParams hook instead of params prop
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [students, setStudents] = useState<Student[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDropConfirmation, setShowDropConfirmation] = useState(false);
  const [dropData, setDropData] = useState<{registrationId: string, username: string} | null>(null);
  const [dropping, setDropping] = useState(false);
  const router = useRouter();
  
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`${API_BASE}/courses/${courseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err: any) {
        setError('Failed to fetch course details');
      }
    };

    const fetchStudents = async () => {
        try {
          console.log(`Fetching students from: ${API_BASE}/courses/${courseId}/students`);
          
          const response = await fetch(`${API_BASE}/courses/${courseId}/students`);
          console.log('Response status:', response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Server returned ${response.status}: ${errorText}`);
          }
          
          const data = await response.json();
          console.log('Students data received:', data);
          
          // Check if data is an array before setting it
          if (Array.isArray(data)) {
            setStudents(data);
          } else {
            console.error('Received non-array data:', data);
            setStudents([]);
            setError('Received invalid data format from server');
          }
        } catch (err: any) {
          console.error('Complete error details:', err);
          setError(`Failed to fetch students: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };

    if (courseId) {
      fetchCourseDetails();
      fetchStudents();
    }
  }, [courseId, API_BASE]);

  const handleDropClick = (registrationId: string, username: string) => {
    setDropData({ registrationId, username });
    setShowDropConfirmation(true);
  };

  const confirmDrop = async () => {
    if (!dropData) return;
    
    setDropping(true);
    try {
      const response = await fetch(`${API_BASE}/registrations/${dropData.registrationId}/drop`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error('Failed to drop student');
      }
      
      // Refresh students list
      const updatedStudents = students.filter(student => 
        student.registrationId !== dropData.registrationId
      );
      setStudents(updatedStudents);
      
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

  const goBack = () => {
    router.push('/professor/coursesview');
  };

  // Page content for inside the layout
  const PageContent = () => {
    if (loading) return <div>Loading...</div>;
    if (error) return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={goBack}>Back to Courses</button>
      </div>
    );

    return (
      <div className="page-container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{
            color: '#1e3a8a',
            fontSize: '28px',
            fontWeight: 600
          }}>
            {course ? `${course.courseName} (${course.courseCode})` : 'Courses'} - Students
          </h1>
          <button 
            onClick={goBack}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Back to Courses
          </button>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          marginTop: '24px'
        }}>
          {students.length > 0 ? (
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '12px',
              background: 'white',
              borderRadius: '6px',
              overflow: 'hidden'
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
                        }}>Student ID</th>
                        <th style={{
                        background: '#f8fafc',
                        color: '#374151',
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: 600,
                        borderBottom: '2px solid #e5e7eb'
                        }}>Name</th>
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
                        textAlign: 'center',
                        fontWeight: 600,
                        borderBottom: '2px solid #e5e7eb'
                        }}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map(student => (
                        <tr key={student._id}>
                        <td style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#4b5563'
                        }}>{student._id}</td>
                        <td style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#4b5563'
                        }}>
                            {(() => {
                              const fullName = `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim();
                              return fullName || student.fullName || student.username || 'Unknown';
                            })()}
                        </td>
                        <td style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #e5e7eb',
                            color: '#4b5563'
                        }}>{student.grade || '-'}</td>
                        <td style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #e5e7eb',
                            textAlign: 'center'
                        }}>
                            <button
                            onClick={() => handleDropClick(
                                student.registrationId, 
                                student.firstName || student.lastName ? 
                                `${student.firstName || ''} ${student.lastName || ''}`.trim() : 
                                (student.fullName || (student as any).username || 'Unknown')
                            )}
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
                        </td>
                        </tr>
                    ))}
                    </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', color: '#374151', marginBottom: '8px' }}>
                No students enrolled in this course
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                There are currently no students enrolled in this course.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <PageContent />
      
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
                Are you sure you want to drop {dropData.username} from this course?
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
    </>
  );
}