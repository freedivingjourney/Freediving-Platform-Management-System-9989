import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import AuthModal from './AuthModal';

const Layout = () => {
  const { isAuthenticated, isApproved } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100">
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
      {!isAuthenticated && <AuthModal />}
    </div>
  );
};

export default Layout;