import { Layout, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const { Header } = Layout;

const AppHeader = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Header
      style={{
        background: '#001529',
        color: '#fff',
        padding: '0 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div
        style={{ fontSize: '22px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}
        onClick={() => navigate('/tasks')}
      >
        📋 Task Manager
      </div>

      {isAuthenticated && (
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      )}
    </Header>
  );
};

export default AppHeader;
