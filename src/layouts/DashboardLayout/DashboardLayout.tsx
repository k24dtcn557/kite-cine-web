import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { UserSidebar, UserTopbar } from '../../components';
import styles from './DashboardLayout.module.css';

const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Fixed Sidebar */}
      <UserSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main Content Area */}
      <div className={styles.mainContainer}>
        {/* Fixed Topbar */}
        <UserTopbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable Content Canvas */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
