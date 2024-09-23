import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminHome from './components/AdminHome';
import UserHome from './components/UserHome';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token || userRole !== role) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin-home"
          element={
            <PrivateRoute role="admin">
              <AdminHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-home"
          element={
            <PrivateRoute role="user">
              <UserHome />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;