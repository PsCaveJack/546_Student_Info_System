// components/layout/AdminLayout.tsx
import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <div className="admin-nav-header">
          <h1>Admin Dashboard</h1>
        </div>
        <ul className="admin-nav-links">
          <li>
            <a href="/admin">Dashboard</a>
          </li>
          <li>
            <a href="/admin/course-control">Course Control</a>
          </li>
          <li>
            <a href="/admin/course-control/professor-student-view">View Students</a>
          </li>
          <li>
            <a href="/admin/account-control">Account Control</a>
          </li>
          <li>
            <a href="/admin/graduation-check">Graduation Check</a>
          </li>
        </ul>
      </nav>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;