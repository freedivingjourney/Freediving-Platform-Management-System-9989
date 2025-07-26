import React from 'react';
import { Outlet } from 'react-router-dom';
import { useQuestAuth } from '../contexts/QuestAuthContext';
import Navbar from './Navbar';

const Layout = () => {
  const { isAuthenticated } = useQuestAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100">
      {isAuthenticated && <Navbar />}
      <main className="relative">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;