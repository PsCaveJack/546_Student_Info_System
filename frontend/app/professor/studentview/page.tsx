// app/admin/course-control/professor-student-view/page.tsx
import React from 'react';
import ProfessorLayout from '../../../components/layout/ProfessorLayout';
import ProfessorStudentList from '../../../components/courses/ProfessorStudentList';

const ProfessorStudentsPage: React.FC = () => {
  return (
    <ProfessorLayout>
      <div className="page-container">
        <ProfessorStudentList />
      </div>
    </ProfessorLayout>
  );
};

export default ProfessorStudentsPage;