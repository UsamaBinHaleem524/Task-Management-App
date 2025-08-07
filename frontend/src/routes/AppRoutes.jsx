import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import Login from '../components/Login';
import Signup from '../components/Signup';
import TaskList from '../components/TaskList';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const { Content } = Layout;

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      />
    );
  }

  return (
    <Layout>
      <Header />
      <Content style={{ padding: '50px', background: '#fff' }}>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/tasks" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/tasks" /> : <Signup />} />
          <Route path="/tasks" element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/tasks" : "/login"} />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default AppRoutes;
