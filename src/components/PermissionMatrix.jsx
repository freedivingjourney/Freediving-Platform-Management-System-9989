import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRole, ROLES, PERMISSIONS } from '../contexts/RoleContext';
import RoleBadge from './RoleBadge';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiX, FiInfo, FiFilter } = FiIcons;

const PermissionMatrix = ({ showRoleFilter = true, compact = false }) => {
  const { getRoleDisplayName } = useRole();
  const [selectedRoles, setSelectedRoles] = useState(Object.values(ROLES));
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Group permissions by category
  const permissionCategories = {
    'User Management': [
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.MANAGE_APPLICATIONS,
      PERMISSIONS.VIEW_ALL_DATA
    ],
    'Content & Courses': [
      PERMISSIONS.CREATE_COURSES,
      PERMISSIONS.MANAGE_STUDENTS,
      PERMISSIONS.VIEW_STUDENT_PROGRESS,
      PERMISSIONS.APPROVE_CERTIFICATIONS
    ],
    'Events & Community': [
      PERMISSIONS.CREATE_EVENTS,
      PERMISSIONS.MODERATE_CONTENT,
      PERMISSIONS.ACCESS_COMMUNITY,
      PERMISSIONS.JOIN_EVENTS
    ],
    'Personal Features': [
      PERMISSIONS.LOG_DIVES,
      PERMISSIONS.SET_GOALS,
      PERMISSIONS.VIEW_COURSES,
      PERMISSIONS.BOOK_SESSIONS
    ],
    'System & Support': [
      PERMISSIONS.MANAGE_SYSTEM,
      PERMISSIONS.VIEW_PROFILE,
      PERMISSIONS.EDIT_PROFILE,
      PERMISSIONS.CONTACT_SUPPORT
    ]
  };

  // Role permissions mapping (from RoleContext)
  const rolePermissions = {
    [ROLES.ADMIN]: [
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.MANAGE_APPLICATIONS,
      PERMISSIONS.MANAGE_SYSTEM,
      PERMISSIONS.VIEW_ALL_DATA,
      PERMISSIONS.MODERATE_CONTENT,
      PERMISSIONS.CREATE_COURSES,
      PERMISSIONS.MANAGE_STUDENTS,
      PERMISSIONS.VIEW_STUDENT_PROGRESS,
      PERMISSIONS.APPROVE_CERTIFICATIONS,
      PERMISSIONS.CREATE_EVENTS,
      PERMISSIONS.LOG_DIVES,
      PERMISSIONS.SET_GOALS,
      PERMISSIONS.JOIN_EVENTS,
      PERMISSIONS.ACCESS_COMMUNITY,
      PERMISSIONS.VIEW_COURSES,
      PERMISSIONS.BOOK_SESSIONS,
      PERMISSIONS.VIEW_PROFILE,
      PERMISSIONS.EDIT_PROFILE,
      PERMISSIONS.CONTACT_SUPPORT
    ],
    [ROLES.INSTRUCTOR]: [
      PERMISSIONS.CREATE_COURSES,
      PERMISSIONS.MANAGE_STUDENTS,
      PERMISSIONS.VIEW_STUDENT_PROGRESS,
      PERMISSIONS.APPROVE_CERTIFICATIONS,
      PERMISSIONS.CREATE_EVENTS,
      PERMISSIONS.LOG_DIVES,
      PERMISSIONS.SET_GOALS,
      PERMISSIONS.JOIN_EVENTS,
      PERMISSIONS.ACCESS_COMMUNITY,
      PERMISSIONS.VIEW_COURSES,
      PERMISSIONS.BOOK_SESSIONS,
      PERMISSIONS.VIEW_PROFILE,
      PERMISSIONS.EDIT_PROFILE,
      PERMISSIONS.CONTACT_SUPPORT
    ],
    [ROLES.STUDENT]: [
      PERMISSIONS.LOG_DIVES,
      PERMISSIONS.SET_GOALS,
      PERMISSIONS.JOIN_EVENTS,
      PERMISSIONS.ACCESS_COMMUNITY,
      PERMISSIONS.VIEW_COURSES,
      PERMISSIONS.BOOK_SESSIONS,
      PERMISSIONS.VIEW_PROFILE,
      PERMISSIONS.EDIT_PROFILE,
      PERMISSIONS.CONTACT_SUPPORT
    ],
    [ROLES.MEMBER]: [
      PERMISSIONS.LOG_DIVES,
      PERMISSIONS.SET_GOALS,
      PERMISSIONS.JOIN_EVENTS,
      PERMISSIONS.ACCESS_COMMUNITY,
      PERMISSIONS.VIEW_COURSES,
      PERMISSIONS.VIEW_PROFILE,
      PERMISSIONS.EDIT_PROFILE,
      PERMISSIONS.CONTACT_SUPPORT
    ]
  };

  const hasPermission = (role, permission) => {
    return rolePermissions[role]?.includes(permission) || false;
  };

  const getPermissionsToShow = () => {
    if (selectedCategory === 'all') {
      return Object.values(permissionCategories).flat();
    }
    return permissionCategories[selectedCategory] || [];
  };

  const formatPermissionName = (permission) => {
    return permission
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Permission Matrix</h3>
        
        {showRoleFilter && (
          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {Object.keys(permissionCategories).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Permission
              </th>
              {selectedRoles.map(role => (
                <th key={role} className="text-center py-3 px-4">
                  <RoleBadge role={role} size="sm" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {selectedCategory !== 'all' ? (
              // Show permissions by category
              Object.entries(permissionCategories)
                .filter(([category]) => selectedCategory === 'all' || category === selectedCategory)
                .map(([category, permissions]) => (
                  <React.Fragment key={category}>
                    <tr className="bg-gray-50">
                      <td colSpan={selectedRoles.length + 1} className="py-2 px-4 font-semibold text-gray-700 text-sm">
                        {category}
                      </td>
                    </tr>
                    {permissions.map(permission => (
                      <tr key={permission} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {formatPermissionName(permission)}
                            </span>
                            <SafeIcon icon={FiInfo} className="text-gray-400 text-xs" />
                          </div>
                        </td>
                        {selectedRoles.map(role => (
                          <td key={role} className="py-3 px-4 text-center">
                            {hasPermission(role, permission) ? (
                              <SafeIcon icon={FiCheck} className="text-green-600 mx-auto" />
                            ) : (
                              <SafeIcon icon={FiX} className="text-gray-300 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))
            ) : (
              // Show all permissions grouped by category
              Object.entries(permissionCategories).map(([category, permissions]) => (
                <React.Fragment key={category}>
                  <tr className="bg-gray-50">
                    <td colSpan={selectedRoles.length + 1} className="py-2 px-4 font-semibold text-gray-700 text-sm">
                      {category}
                    </td>
                  </tr>
                  {permissions.map(permission => (
                    <tr key={permission} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {formatPermissionName(permission)}
                          </span>
                        </div>
                      </td>
                      {selectedRoles.map(role => (
                        <td key={role} className="py-3 px-4 text-center">
                          {hasPermission(role, permission) ? (
                            <SafeIcon icon={FiCheck} className="text-green-600 mx-auto" />
                          ) : (
                            <SafeIcon icon={FiX} className="text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="text-green-600" />
              <span>Has Permission</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiX} className="text-gray-300" />
              <span>No Permission</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Permissions are hierarchical - higher roles inherit lower role permissions
          </p>
        </div>
      </div>
    </div>
  );
};

export default PermissionMatrix;