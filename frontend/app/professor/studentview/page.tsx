// app/admin/course-control/professor-student-view/page.tsx
import React from 'react';
import ProfessorStudentLayout from '../../../components/layout/ProfessorLayout';
import ProfessorStudentList from '../../../components/courses/ProfessorStudentList';

const ProfessorStudentsPage: React.FC = () => {
  return (
      <div className="page-container">
        <ProfessorStudentList />
      </div>
  );
};

export default ProfessorStudentsPage;