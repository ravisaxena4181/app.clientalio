import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CollectTestimonial from './components/CollectTestimonial';
import PrivateRoute from './components/PrivateRoute';
import { auth } from './utils/auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={auth.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/collect" 
          element={
            <PrivateRoute>
              <CollectTestimonial />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to={auth.isAuthenticated() ? "/dashboard" : "/login"} replace />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
