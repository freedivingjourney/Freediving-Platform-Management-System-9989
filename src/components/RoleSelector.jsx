import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRole, ROLES, PERMISSIONS } from '../contexts/RoleContext';
import RoleBadge from './RoleBadge';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiChevronDown, FiCheck, FiInfo } = FiIcons;

const RoleSelector = ({ currentRole, onRoleChange, disabled = false, showPermissions = false }) => {
  const { getRoleDisplayName, getRoleColor } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleInfo, setShowRoleInfo] = useState(null);

  const roleHierarchy = [
    {
      role: ROLES.ADMIN,
      description: 'Full system access and user management',
      permissions: [
        'Manage all users and applications',
        'System configuration and settings',
        'Content moderation and oversight',
        'Access to all platform features'
      ]
    },
    {
      role: ROLES.INSTRUCTOR,
      description: 'Teaching and student management capabilities',
      permissions: [
        'Create and manage courses',
        'Approve certifications',
        'Manage student progress',
        'Create events and workshops'
      ]
    },
    {
      role: ROLES.STUDENT,
      description: 'Enhanced learning and progress tracking',
      permissions: [
        'Advanced dive logging',
        'Goal setting and tracking',
        'Book instructor sessions',
        'Access to all courses'
      ]
    },
    {
      role: ROLES.MEMBER,
      description: 'Basic community access and features',
      permissions: [
        'Basic dive logging',
        'Community discussions',
        'View public courses',
        'Join public events'
      ]
    }
  ];

  const handleRoleSelect = (role) => {
    if (!disabled && onRoleChange) {
      onRoleChange(role);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
          disabled 
            ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
            : 'bg-white border-gray-300 hover:border-ocean-400 focus:ring-2 focus:ring-ocean-500 focus:border-transparent'
        }`}
      >
        <RoleBadge role={currentRole} />
        {!disabled && (
          <SafeIcon 
            icon={FiChevronDown} 
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </button>

      {isOpen && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <div className="py-2">
            {roleHierarchy.map((roleData) => (
              <div key={roleData.role}>
                <button
                  onClick={() => handleRoleSelect(roleData.role)}
                  onMouseEnter={() => showPermissions && setShowRoleInfo(roleData.role)}
                  onMouseLeave={() => setShowRoleInfo(null)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    currentRole === roleData.role ? 'bg-ocean-50' : ''
                  }`}
                >
                  <div>
                    <RoleBadge role={roleData.role} />
                    <p className="text-xs text-gray-500 mt-1">{roleData.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {showPermissions && (
                      <SafeIcon icon={FiInfo} className="text-gray-400" />
                    )}
                    {currentRole === roleData.role && (
                      <SafeIcon icon={FiCheck} className="text-ocean-600" />
                    )}
                  </div>
                </button>

                {/* Role Permissions Tooltip */}
                {showPermissions && showRoleInfo === roleData.role && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute left-full top-0 ml-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-60"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {getRoleDisplayName(roleData.role)} Permissions
                    </h4>
                    <ul className="space-y-1">
                      {roleData.permissions.map((permission, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start space-x-2">
                          <SafeIcon icon={FiCheck} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RoleSelector;