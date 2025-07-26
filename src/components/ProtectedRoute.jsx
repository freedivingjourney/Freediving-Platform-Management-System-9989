import React from 'react';
import { useRole } from '../contexts/RoleContext';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLock, FiShield, FiAlertTriangle } = FiIcons;

const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requiredRole = null,
  fallback = null,
  showFallback = true 
}) => {
  const { hasPermission, hasAnyPermission, getUserRole, getRoleDisplayName } = useRole();
  
  // Check role-based access
  if (requiredRole && getUserRole() !== requiredRole) {
    if (!showFallback) return null;
    
    return fallback || (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiLock} className="text-2xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            This page requires {getRoleDisplayName(requiredRole)} privileges. 
            Your current role is {getRoleDisplayName(getUserRole())}.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    );
  }
  
  // Check permission-based access
  if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions)) {
    if (!showFallback) return null;
    
    return fallback || (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiShield} className="text-2xl text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Insufficient Permissions</h2>
          <p className="text-gray-600 mb-6">
            You don't have the required permissions to access this page. 
            Contact an administrator if you believe this is an error.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    );
  }
  
  return children;
};

export default ProtectedRoute;