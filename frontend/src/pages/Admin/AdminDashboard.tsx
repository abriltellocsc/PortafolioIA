import { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import UserManagement from './UserManagement';
import PortfolioManagement from './PortfolioManagement';
import SupportMessages from './SupportMessages';
import AdminLogs from './AdminLogs';
import AdminUserLogs from './AdminUserLogs';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('users');

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'portfolios':
        return <PortfolioManagement />;
      case 'support':
        return <SupportMessages />;
      case 'logs':
        return <AdminLogs />;
      case 'user-logs':
        return <AdminUserLogs />;
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
