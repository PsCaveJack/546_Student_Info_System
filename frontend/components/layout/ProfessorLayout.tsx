// components/layout/ProfessorLayout.tsx
import React from 'react';

interface ProfessorLayoutProps {
  children: React.ReactNode;
}

const ProfessorLayout: React.FC<ProfessorLayoutProps> = ({ children }) => {
  return (
    <div className="professor-layout">
      <nav className="professor-nav">
        <div className="professor-nav-header">
          <h1>Professor Dashboard</h1>
        </div>
        <ul className="professor-nav-links">
          <li>
            <a href="/professor">Dashboard</a>
          </li>
          <li>
            <a href="/professor/courses">My Courses</a>
          </li>
          <li>
            <a href="/professor/studentview">My Students</a>
          </li>
          <li>
            <a href="/professor/schedule">Schedule</a>
          </li>
          <li>
            <a href="/professor/reports">Reports</a>
          </li>
        </ul>
      </nav>
      <main className="professor-content">
        {children}
      </main>
    </div>
  );
};

export default ProfessorLayout;