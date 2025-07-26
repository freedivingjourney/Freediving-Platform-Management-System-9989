import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRole, ROLES, PERMISSIONS } from '../contexts/RoleContext';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleBadge from '../components/RoleBadge';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiSearch, FiFilter, FiEdit, FiTrash2, FiShield, FiMail, FiPhone, FiMapPin, FiCalendar, FiCheck, FiX } = FiIcons;

const UserManagement = () => {
  const { isAdmin } = useRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock user data
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
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
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

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      suspended: 'text-red-600 bg-red-100',
      inactive: 'text-gray-600 bg-gray-100'
    };
    return colors[status] || colors.inactive;
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">
              Manage user accounts, roles, and permissions
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
                <span className="text-3xl font-bold text-purple-600">
                  {users.filter(u => u.role === ROLES.INSTRUCTOR).length}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Instructors</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <SafeIcon icon={FiUsers} className="text-2xl text-green-500" />
                <span className="text-3xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Active Users</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <SafeIcon icon={FiCalendar} className="text-2xl text-yellow-500" />
                <span className="text-3xl font-bold text-yellow-600">
                  {users.filter(u => u.status === 'pending').length}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="grid md:grid-cols-3 gap-4">
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
              <div className="flex items-center space-x-2 text-gray-600">
                <SafeIcon icon={FiUsers} />
                <span className="font-medium">{filteredUsers.length} users found</span>
              </div>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Location</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Active</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <SafeIcon icon={FiMapPin} className="text-xs" />
                          <span className="text-sm">{user.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">{user.lastActive}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                          >
                            <option value={ROLES.ADMIN}>Admin</option>
                            <option value={ROLES.INSTRUCTOR}>Instructor</option>
                            <option value={ROLES.STUDENT}>Student</option>
                            <option value={ROLES.MEMBER}>Member</option>
                          </select>
                          <select
                            value={user.status}
                            onChange={(e) => handleStatusChange(user.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                          >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="suspended">Suspended</option>
                            <option value="inactive">Inactive</option>
                          </select>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <SafeIcon icon={FiTrash2} className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Role Permissions Reference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Role Permissions Reference</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RoleBadge role={ROLES.ADMIN} />
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Full system access</li>
                  <li>• User management</li>
                  <li>• Content moderation</li>
                  <li>• System configuration</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RoleBadge role={ROLES.INSTRUCTOR} />
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create courses</li>
                  <li>• Manage students</li>
                  <li>• Approve certifications</li>
                  <li>• Create events</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RoleBadge role={ROLES.STUDENT} />
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Log dives</li>
                  <li>• Set goals</li>
                  <li>• Join events</li>
                  <li>• Book sessions</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RoleBadge role={ROLES.MEMBER} />
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Basic dive logging</li>
                  <li>• Community access</li>
                  <li>• View courses</li>
                  <li>• Limited features</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserManagement;