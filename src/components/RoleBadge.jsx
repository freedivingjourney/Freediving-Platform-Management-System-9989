import React from 'react';
import { useRole } from '../contexts/RoleContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiUser, FiBook, FiUsers } = FiIcons;

const RoleBadge = ({ role, size = 'sm', showIcon = true, className = '' }) => {
  const { getRoleDisplayName, getRoleColor } = useRole();
  
  const roleIcons = {
    admin: FiShield,
    instructor: FiUser,
    student: FiBook,
    member: FiUsers
  };
  
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const color = getRoleColor(role);
  const displayName = getRoleDisplayName(role);
  const IconComponent = roleIcons[role] || FiUsers;
  
  return (
    <span 
      className={`
        inline-flex items-center space-x-1 font-medium rounded-full
        bg-${color}-100 text-${color}-800 border border-${color}-200
        ${sizeClasses[size]} ${className}
      `}
    >
      {showIcon && <SafeIcon icon={IconComponent} className="text-current" />}
      <span>{displayName}</span>
    </span>
  );
};

export default RoleBadge;