import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar, AdminTopbar } from '../../components';
import styles from './AdminLayout.module.css';

const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Fixed Sidebar */}
      <AdminSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main Content Area */}
      <div className={styles.mainContainer}>
        {/* Fixed Topbar */}
        <AdminTopbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable Content Canvas */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
