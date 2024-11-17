import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import AuthLayout from './layouts/auth/AuthLayout';
import DashboardLayOut from './layouts/DashboardLayOut';
import { APP_ROUTES } from './constants/app_route';
import LogIn from './pages/auth/LogIn';
import Dashboard from './pages/dashboard/Dashboard';
import './App.css';

const App: React.FC = () => {
  // Get token from Redux (or use localStorage if preferred)
  const token = localStorage.getItem("_token")

  // ProtectedRoute component logic (inline)
  const ProtectedRoute = ({ component: Component, ...rest }: any) => {
    return (
      <Route
        {...rest}
        render={(props: any) =>
          token ? (
            <Component {...props} />
          ) : (
              <Navigate to={"/"} />
          )
        }
      />
    );
  };


  return (
    <Router>
      <Routes>
        <>
          <Route element={<AuthLayout />}>
            <Route path={APP_ROUTES?.AUTH.LOGIN} Component={LogIn} />
          </Route>


          {/* Protected Route */}
          {/* <ProtectedRoute element={<DashboardLayOut />} >
            <Route path={`${APP_ROUTES?.DASHBOARD}/*`} Component={Dashboard} />
          </ProtectedRoute> */}
          {/* <Route
            path="/dashboard"
            element={token ? <DashboardPage /> : <Navigate to="/login" />}
          /> */}


          {/* Redirect to Home if no route matched */}
          <Route path="*" element={<Navigate to="/home" />} />
        </>
      </Routes>
    </Router>
  );
};

export default App;
