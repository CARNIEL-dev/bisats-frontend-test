import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';

import './App.css';
import { APP_ROUTES } from './constants/app_route';
import AuthLayout from './layouts/auth/AuthLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
// import ProtectedRoute from './utils/protectedRoutes';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={APP_ROUTES?.AUTH.LOGIN} element={<Login />} />
        </Route>
        <Route 
          path={APP_ROUTES.DASHBOARD} 
          element={
            <Dashboard />
          } 
        />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default App;
