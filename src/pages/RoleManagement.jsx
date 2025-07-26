import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRole, ROLES, PERMISSIONS } from '../contexts/RoleContext';
import ProtectedRoute from '../components/ProtectedRoute';
import PermissionMatrix from '../components/PermissionMatrix';
import UserRoleCard from '../components/UserRoleCard';
import RoleSelector from '../components/RoleSelector';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiShield, FiSettings, FiSearch, FiFilter, FiPlus, FiDownload, FiUpload } = FiIcons;

const RoleManagement = () => {
  const { isAdmin } = useRole();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock user data - would come from backend
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@freedivehub.com',
      phone: '+357 99 123456',
      location: 'Cyprus',
      role: ROLES.INSTRUCTOR,
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-05-20',
      certifications: ['AIDA Master Instructor', 'SSI Level 3'],
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@freedivehub.com',
      phone: '+63 917 123456',
      location: 'Philippines',
      role: ROLES.INSTRUCTOR,
      status: 'active',
      joinDate: '2024-02-01',
      lastActive: '2024-05-19',
      certifications: ['AIDA Instructor', 'Competition Coach'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      email: 'emma@freedivehub.com',
      phone: '+52 998 765432',
      location: 'Mexico',
      role: ROLES.STUDENT,
      status: 'active',
      joinDate: '2024-03-10',
      lastActive: '2024-05-20',
      certifications: ['AIDA 2', 'SSI Level 1'],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face'
    },
    {
      id: '4',
      name: 'David Park',
      email: 'david@freedivehub.com',
      phone: '+66 81 234567',
      location: 'Thailand',
      role: ROLES.MEMBER,
      status: 'pending',
      joinDate: '2024-05-15',
      lastActive: '2024-05-18',
      certifications: ['AIDA 1'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const roleStats = {
    [ROLES.ADMIN]: users.filter(u => u.role === ROLES.ADMIN).length,
    [ROLES.INSTRUCTOR]: users.filter(u => u.role === ROLES.INSTRUCTOR).length,
    [ROLES.STUDENT]: users.filter(u => u.role === ROLES.STUDENT).length,
    [ROLES.MEMBER]: users.filter(u => u.role === ROLES.MEMBER).length,
  };

  const statusStats = {
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    inactive: users.filter(u => u.status === 'inactive').length,
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>
                
                <div className="relative">
                  <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Roles</option>
                    <option value={ROLES.ADMIN}>Administrators</option>
                    <option value={ROLES.INSTRUCTOR}>Instructors</option>
                    <option value={ROLES.STUDENT}>Students</option>
                    <option value={ROLES.MEMBER}>Members</option>
                  </select>
                </div>

                <div className="relative">
                  <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-ocean-600 text-white py-3 px-4 rounded-lg hover:bg-ocean-700 transition-colors flex items-center justify-center space-x-2">
                    <SafeIcon icon={FiPlus} />
                    <span>Add User</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>{filteredUsers.length} users found</span>
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-1 hover:text-ocean-600">
                    <SafeIcon icon={FiDownload} />
                    <span>Export</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-ocean-600">
                    <SafeIcon icon={FiUpload} />
                    <span>Import</span>
                  </button>
                </div>
              </div>
            </div>

            {/* User Cards */}
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredUsers.map((user) => (
                <UserRoleCard
                  key={user.id}
                  user={user}
                  onRoleChange={handleRoleChange}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteUser}
                  canEdit={true}
                  showActions={true}
                />
              ))}
            </div>
          </div>
        );

      case 'permissions':
        return <PermissionMatrix />;

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-approve new members</h4>
                    <p className="text-sm text-gray-600">Automatically approve new member registrations</p>
                  </div>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Require instructor approval for students</h4>
                    <p className="text-sm text-gray-600">Students need instructor approval for advanced features</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Allow role self-upgrade requests</h4>
                    <p className="text-sm text-gray-600">Users can request role upgrades through the platform</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Permissions</h3>
              <p className="text-gray-600 mb-4">Configure default permissions for new users in each role.</p>
              
              <div className="space-y-4">
                {Object.values(ROLES).map(role => (
                  <div key={role} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Default {role} Permissions</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {Object.values(PERMISSIONS).slice(0, 6).map(permission => (
                        <label key={permission} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            defaultChecked={role === ROLES.ADMIN}
                            className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                          />
                          <span className="text-gray-700">
                            {permission.replace(/_/g, ' ').toLowerCase()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute requiredPermissions={[PERMISSIONS.MANAGE_USERS]}>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Role Management</h1>
            <p className="text-gray-600">
              Manage user roles, permissions, and access control
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <SafeIcon icon={FiUsers} className="text-2xl text-blue-500" />
                <span className="text-3xl font-bold text-blue-600">{users.length}</span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <SafeIcon icon={FiShield} className="text-2xl text-purple-500" />
                <span className="text-3xl font-bold text-purple-600">{roleStats[ROLES.INSTRUCTOR]}</span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Instructors</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <SafeIcon icon={FiUsers} className="text-2xl text-green-500" />
                <span className="text-3xl font-bold text-green-600">{statusStats.active}</span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Active Users</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <SafeIcon icon={FiSettings} className="text-2xl text-yellow-500" />
                <span className="text-3xl font-bold text-yellow-600">{statusStats.pending}</span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Pending Approval</p>
            </div>
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
                  onClick={() => setActiveTab('users')}
                  className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === 'users'
                      ? 'border-b-2 border-ocean-600 text-ocean-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <SafeIcon icon={FiUsers} />
                  <span>User Management</span>
                </button>
                <button
                  onClick={() => setActiveTab('permissions')}
                  className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === 'permissions'
                      ? 'border-b-2 border-ocean-600 text-ocean-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <SafeIcon icon={FiShield} />
                  <span>Permission Matrix</span>
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
                  <span>Role Settings</span>
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
    </ProtectedRoute>
  );
};

export default RoleManagement;