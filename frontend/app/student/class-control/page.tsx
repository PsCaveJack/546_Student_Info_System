// frontend/app/student/class-control/page.tsx
"use client";
import { useEffect, useState } from "react";
import { fetchStudentActiveClasses } from "@/fetchers/classFetchers";
import { dropClass } from "@/handlers/classHandlers";

// Replace this with session-based ID later
const studentId = "67f38885cfae5e70ec671986";

export default function ClassControlPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStudentInfo, setLoadingStudentInfo] = useState(true);
  const [dropInProgress, setDropInProgress] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [classToDropId, setClassToDropId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);
    try {
      const data = await fetchStudentActiveClasses(studentId);
      setClasses(data);
    } catch (err: any) {
      console.error("Failed to load classes:", err);
      setError("Failed to load your classes");
      setErrorDetails(err.message || "Please try again or contact support if the issue persists.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDrop = (regId: string) => {
    setClassToDropId(regId);
    setShowConfirmModal(true);
  };

  const handleDrop = async () => {
    if (!classToDropId) return;
    
    setDropInProgress(classToDropId);
    setError(null);
    try {
      await dropClass(classToDropId);
      await loadClasses();
    } catch (err: any) {
      console.error("Failed to drop class:", err);
      setError("Failed to drop the class");
      setErrorDetails(err.message || "Please try again or contact support if the issue persists.");
    } finally {
      setDropInProgress(null);
      setShowConfirmModal(false);
      setClassToDropId(null);
    }
  };

  const cancelDrop = () => {
    setShowConfirmModal(false);
    setClassToDropId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header section */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800">Active Classes</h1>
          <p className="text-gray-600 mt-2">
            View and manage your current course enrollment
          </p>
        </div>
      </header>

{/* Main content section */}
<main className="flex-grow">
  <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    {/* Debug information */}
    <div className="mb-4 p-4 bg-blue-100 rounded text-xs font-mono overflow-auto">
      <p className="text-gray-700">Student ID: {studentId}</p>
    </div>
    
    {/* Error message */}
    {error && (
      <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p className="font-bold">{error}</p>
        {errorDetails && <p className="text-sm">{errorDetails}</p>}
        <button 
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          onClick={() => {setError(null); setErrorDetails(null);}}
          aria-label="Dismiss"
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    )}
    
    {loading ? (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    ) : classes.length === 0 ? (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No active classes</h3>
        <p className="mt-1 text-sm text-gray-500">
          You are not currently enrolled in any classes.
        </p>
        <button
          onClick={() => loadClasses()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Refresh
        </button>
      </div>
    ) : (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Enrolled Classes
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {classes.map((reg) => (
            <li key={reg._id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {reg.sectionId?.courseCode?.substring(0, 2) || "CL"}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {reg.sectionId?.courseName || "Course Name"}
                      </h3>
                      <div className="flex flex-wrap mt-1">
                        <span className="text-sm text-gray-500 mr-3">
                          {reg.sectionId?.courseCode || "N/A"}
                        </span>
                        <span className="text-sm text-gray-500 mr-3">
                          {reg.sectionId?.semester || "Current Semester"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {reg.sectionId?.instructor || "Instructor"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => confirmDrop(reg._id)}
                    disabled={dropInProgress === reg._id}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm 
                    ${dropInProgress === reg._id 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}`}
                  >
                    {dropInProgress === reg._id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Drop Class"
                    )}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Drop Class</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to drop this class? This action cannot be undone and may affect your academic record.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleDrop}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Drop Class
              </button>
              <button
                type="button"
                onClick={cancelDrop}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}