import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiShield, FiSettings, FiActivity, FiAlertTriangle, FiCheck, FiX, FiMail, FiCalendar } = FiIcons;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('applications');

  // Mock data for pending applications
  const pendingApplications = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      location: 'California, USA',
      certifications: 'AIDA 2, Molchanovs Wave 1',
      bio: 'Passionate freediver with 3 years experience. Looking to connect with the community and improve my skills.',
      appliedDate: '2024-05-20',
      referral: 'Sarah Johnson'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      location: 'Barcelona, Spain',
      certifications: 'SSI Level 1',
      bio: 'New to freediving but very enthusiastic. Completed my first course and eager to learn more.',
      appliedDate: '2024-05-19',
      referral: 'David Park'
    }
  ];

  const systemStats = [
    { label: 'Total Members', value: '247', icon: FiUsers, color: 'ocean' },
    { label: 'Pending Applications', value: '12', icon: FiShield, color: 'yellow' },
    { label: 'Active Instructors', value: '18', icon: FiActivity, color: 'green' },
    { label: 'System Alerts', value: '3', icon: FiAlertTriangle, color: 'red' }
  ];

  const handleApproveApplication = (id) => {
    console.log('Approving application:', id);
  };

  const handleRejectApplication = (id) => {
    console.log('Rejecting application:', id);
  };

  const renderApplications = () => (
    <div className="space-y-6">
      {pendingApplications.map((app) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
              <p className="text-gray-600">{app.email}</p>
              <p className="text-sm text-gray-500">{app.location}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleApproveApplication(app.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiCheck} />
                <span>Approve</span>
              </button>
              <button
                onClick={() => handleRejectApplication(app.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiX} />
                <span>Reject</span>
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
              <p className="text-gray-700 text-sm">{app.certifications}</p>
              
              <h4 className="font-semibold text-gray-900 mb-2 mt-4">Referral</h4>
              <p className="text-gray-700 text-sm">{app.referral}</p>
              
              <h4 className="font-semibold text-gray-900 mb-2 mt-4">Applied</h4>
              <p className="text-gray-700 text-sm">{app.appliedDate}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
              <p className="text-gray-700 text-sm">{app.bio}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderMembers = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Management</h3>
      <p className="text-gray-600">Member management interface would go here.</p>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
      <p className="text-gray-600">System configuration options would go here.</p>
    </div>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'applications':
        return renderApplications();
      case 'members':
        return renderMembers();
      case 'settings':
        return renderSettings();
      default:
        return renderApplications();
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Manage applications, members, and system settings
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          {systemStats.map((stat, index) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <SafeIcon icon={stat.icon} className={`text-2xl text-${stat.color}-500`} />
                <span className={`text-3xl font-bold text-${stat.color}-600`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg mb-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'applications' 
                  ? 'border-b-2 border-ocean-600 text-ocean-600' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiMail} />
                <span>Applications</span>
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'members' 
                  ? 'border-b-2 border-ocean-600 text-ocean-600' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiUsers} />
                <span>Members</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'settings' 
                  ? 'border-b-2 border-ocean-600 text-ocean-600' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiSettings} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;