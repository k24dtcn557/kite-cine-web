import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar, AdminTopbar } from '../../components';
import styles from './AdminLayout.module.css';

const AdminLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className={styles.mainContainer}>
        {/* Fixed Topbar */}
        <AdminTopbar />

        {/* Scrollable Content Canvas */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
