import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider } from './contexts/RoleContext';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import DiveLog from './pages/DiveLog';
import Analytics from './pages/Analytics';
import Classes from './pages/Classes';
import Directory from './pages/Directory';
import Events from './pages/Events';
import Community from './pages/Community';
import DivePlanner from './pages/DivePlanner';
import HumanDesign from './pages/HumanDesign';
import Diary from './pages/Diary';
import Goals from './pages/Goals';
import AdminPanel from './pages/AdminPanel';
import UserManagement from './pages/UserManagement';
import RoleManagement from './pages/RoleManagement';
import BreathworkTrainer from './pages/BreathworkTrainer';
import FreedivingDiets from './pages/FreedivingDiets';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100">
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<LandingPage />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="dive-log" element={<DiveLog />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="classes" element={<Classes />} />
                  <Route path="directory" element={<Directory />} />
                  <Route path="events" element={<Events />} />
                  <Route path="community" element={<Community />} />
                  <Route path="dive-planner" element={<DivePlanner />} />
                  <Route path="human-design" element={<HumanDesign />} />
                  <Route path="diary" element={<Diary />} />
                  <Route path="goals" element={<Goals />} />
                  <Route path="admin" element={<AdminPanel />} />
                  <Route path="user-management" element={<UserManagement />} />
                  <Route path="role-management" element={<RoleManagement />} />
                  <Route path="breathwork-trainer" element={<BreathworkTrainer />} />
                  <Route path="freediving-diets" element={<FreedivingDiets />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </AppProvider>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;