import { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import UserManagement from './UserManagement';
import SupportMessages from './SupportMessages';
import AdminUserLogs from './AdminUserLogs';
import EducationManagement from './EducationManagement';
import PortfolioManagement from './PortfolioManagement';
import AdminLogs from './AdminLogs';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('users');

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'support':
        return <SupportMessages />;
      case 'user-logs':
        return <AdminUserLogs />;
      case 'education':
        return <EducationManagement />;
      case 'portfolios':
        return <PortfolioManagement />;
      case 'logs':
        return <AdminLogs />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-primary-bg)]">
      <Sidebar onLogout={onLogout} activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 text-[var(--color-text-light)]">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
