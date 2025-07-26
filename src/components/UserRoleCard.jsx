import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRole, ROLES } from '../contexts/RoleContext';
import RoleSelector from './RoleSelector';
import RoleBadge from './RoleBadge';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMail, FiMapPin, FiCalendar, FiEdit, FiSave, FiX, FiShield, FiClock } = FiIcons;

const UserRoleCard = ({ 
  user, 
  onRoleChange, 
  onStatusChange, 
  onDelete, 
  canEdit = false,
  showActions = true,
  compact = false 
}) => {
  const { getRoleDisplayName, getRoleColor } = useRole();
  const [isEditing, setIsEditing] = useState(false);
  const [tempRole, setTempRole] = useState(user.role);
  const [tempStatus, setTempStatus] = useState(user.status);

  const handleSave = () => {
    if (tempRole !== user.role && onRoleChange) {
      onRoleChange(user.id, tempRole);
    }
    if (tempStatus !== user.status && onStatusChange) {
      onStatusChange(user.id, tempStatus);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempRole(user.role);
    setTempStatus(user.status);
    setIsEditing(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <RoleBadge role={user.role} size="sm" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
              {user.status}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiMapPin} />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiCalendar} />
                <span>Joined {formatDate(user.joinDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {showActions && canEdit && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <SafeIcon icon={FiSave} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <SafeIcon icon={FiX} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
              >
                <SafeIcon icon={FiEdit} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Role and Status */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiShield} className="inline mr-2" />
            Role
          </label>
          {isEditing ? (
            <RoleSelector
              currentRole={tempRole}
              onRoleChange={setTempRole}
              showPermissions={true}
            />
          ) : (
            <RoleBadge role={user.role} />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiUser} className="inline mr-2" />
            Status
          </label>
          {isEditing ? (
            <select
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          ) : (
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        {user.certifications && user.certifications.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Certifications</h4>
            <div className="flex flex-wrap gap-2">
              {user.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiClock} />
            <span>Last active: {formatDate(user.lastActive)}</span>
          </div>
          {user.phone && (
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiUser} />
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
          <div className="flex space-x-3">
            <button className="text-ocean-600 hover:text-ocean-700 text-sm font-medium">
              View Profile
            </button>
            <button className="text-ocean-600 hover:text-ocean-700 text-sm font-medium">
              Send Message
            </button>
          </div>
          
          {canEdit && onDelete && (
            <button
              onClick={() => onDelete(user.id)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Remove User
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default UserRoleCard;