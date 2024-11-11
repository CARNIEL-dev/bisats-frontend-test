import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';

import LogIn from './pages/auth/LogIn';
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
            <Navigate to="/login" />
          )
        }
      />
    );
  };

  return (
    <Router>
      <Routes>
        <>

          <Route path="/login" Component={LogIn} />
          {/* <Route path="/home" component={HomePage} /> */}

          {/* Protected Route */}
          {/* <ProtectedRoute path="/dashboard" component={DashboardPage} /> */}
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
