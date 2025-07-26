import React from 'react';
import {HashRouter as Router,Routes,Route} from 'react-router-dom';
import {QuestProvider} from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import {AuthProvider} from './contexts/AuthContext';
import {QuestAuthProvider} from './contexts/QuestAuthContext';
import {RoleProvider} from './contexts/RoleContext';
import {AppProvider} from './contexts/AppContext';
import questConfig from './config/questConfig';
import Layout from './components/Layout';
import QuestProtectedRoute from './components/QuestProtectedRoute';
import LandingPage from './pages/LandingPage';
import QuestLoginPage from './pages/QuestLogin';
import QuestOnboardingPage from './pages/QuestOnboarding';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import DiveLog from './pages/DiveLog';
import Analytics from './pages/Analytics';
import Classes from './pages/Classes';
import Directory from './pages/Directory';
import Events from './pages/Events';
import Community from './pages/Community';
import Forum from './pages/Forum';
import DivePlanner from './pages/DivePlanner';
import HumanDesign from './pages/HumanDesign';
import Diary from './pages/Diary';
import Goals from './pages/Goals';
import AdminPanel from './pages/AdminPanel';
import UserManagement from './pages/UserManagement';
import './App.css';

function App() {
  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <AuthProvider>
        <QuestAuthProvider>
          <RoleProvider>
            <AppProvider>
              <Router>
                <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<QuestProtectedRoute requireAuth={false}><LandingPage /></QuestProtectedRoute>} />
                    <Route path="/login" element={<QuestProtectedRoute requireAuth={false}><QuestLoginPage /></QuestProtectedRoute>} />

                    {/* Protected Routes */}
                    <Route path="/onboarding" element={<QuestProtectedRoute><QuestOnboardingPage /></QuestProtectedRoute>} />

                    {/* Main App Routes */}
                    <Route path="/app" element={<QuestProtectedRoute><Layout /></QuestProtectedRoute>}>
                      <Route index element={<Dashboard />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="dive-log" element={<DiveLog />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="classes" element={<Classes />} />
                      <Route path="directory" element={<Directory />} />
                      <Route path="events" element={<Events />} />
                      <Route path="community" element={<Community />} />
                      <Route path="forum" element={<Forum />} />
                      <Route path="dive-planner" element={<DivePlanner />} />
                      <Route path="human-design" element={<HumanDesign />} />
                      <Route path="diary" element={<Diary />} />
                      <Route path="goals" element={<Goals />} />
                      <Route path="admin" element={<AdminPanel />} />
                      <Route path="user-management" element={<UserManagement />} />
                    </Route>

                    {/* Legacy Routes - Redirect to App */}
                    <Route path="/dashboard" element={<QuestProtectedRoute><Dashboard /></QuestProtectedRoute>} />
                  </Routes>
                </div>
              </Router>
            </AppProvider>
          </RoleProvider>
        </QuestAuthProvider>
      </AuthProvider>
    </QuestProvider>
  );
}

export default App;