import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useRole, PERMISSIONS } from '../contexts/RoleContext';
import RoleBasedAccess from './RoleBasedAccess';
import RoleBadge from './RoleBadge';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiHome, FiBook, FiUsers, FiCalendar, FiShoppingBag, FiMail, FiUser, FiActivity,
  FiTarget, FiCompass, FiHeart, FiEdit3, FiSettings, FiLogOut, FiMenu, FiX,
  FiShield, FiWind, FiApple
} = FiIcons;

const Navbar = () => {
  const { isAuthenticated, isApproved, user, logout } = useAuth();
  const { hasPermission } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const publicNavItems = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Classes', path: '/classes', icon: FiBook },
    { name: 'Directory', path: '/directory', icon: FiUsers },
    { name: 'Events', path: '/events', icon: FiCalendar },
    { name: 'Shop', path: '/shop', icon: FiShoppingBag, external: true },
    { name: 'Contact', path: '/contact', icon: FiMail }
  ];

  const authenticatedNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Dive Log', path: '/dive-log', icon: FiActivity, permissions: [PERMISSIONS.LOG_DIVES] },
    { name: 'Analytics', path: '/analytics', icon: FiTarget, permissions: [PERMISSIONS.LOG_DIVES] },
    { name: 'Classes', path: '/classes', icon: FiBook, permissions: [PERMISSIONS.VIEW_COURSES] },
    { name: 'Directory', path: '/directory', icon: FiUsers },
    { name: 'Events', path: '/events', icon: FiCalendar, permissions: [PERMISSIONS.JOIN_EVENTS] },
    { name: 'Community', path: '/community', icon: FiUsers, permissions: [PERMISSIONS.ACCESS_COMMUNITY] },
    { name: 'Dive Planner', path: '/dive-planner', icon: FiCompass, permissions: [PERMISSIONS.LOG_DIVES] },
    { name: 'Human Design', path: '/human-design', icon: FiHeart },
    { name: 'Diary', path: '/diary', icon: FiEdit3, permissions: [PERMISSIONS.LOG_DIVES] },
    { name: 'Goals', path: '/goals', icon: FiTarget, permissions: [PERMISSIONS.SET_GOALS] },
    { name: 'Breathwork', path: '/breathwork-trainer', icon: FiWind, permissions: [PERMISSIONS.LOG_DIVES] },
    { name: 'Nutrition', path: '/freediving-diets', icon: FiApple, permissions: [PERMISSIONS.LOG_DIVES] }
  ];

  const adminNavItems = [
    { name: 'Admin Panel', path: '/admin', icon: FiShield, permissions: [PERMISSIONS.MANAGE_APPLICATIONS] },
    { name: 'User Management', path: '/user-management', icon: FiUsers, permissions: [PERMISSIONS.MANAGE_USERS] },
    { name: 'Role Management', path: '/role-management', icon: FiShield, permissions: [PERMISSIONS.MANAGE_USERS] }
  ];

  const getVisibleNavItems = () => {
    if (!isAuthenticated || !isApproved) {
      return publicNavItems;
    }

    const items = authenticatedNavItems.filter(item => {
      if (!item.permissions) return true;
      return item.permissions.some(permission => hasPermission(permission));
    });

    // Add admin items if user has permissions
    const adminItems = adminNavItems.filter(item => {
      if (!item.permissions) return true;
      return item.permissions.some(permission => hasPermission(permission));
    });

    return [...items, ...adminItems];
  };

  const navItems = getVisibleNavItems();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-ocean-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-ocean-500 to-ocean-600 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiActivity} className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-ocean-900">FreediveHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.slice(0, 6).map((item) => (
              <RoleBasedAccess key={item.name} permissions={item.permissions || []}>
                <Link
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    location.pathname === item.path
                      ? 'bg-ocean-100 text-ocean-700'
                      : 'text-gray-600 hover:text-ocean-600 hover:bg-ocean-50'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="text-sm" />
                  <span>{item.name}</span>
                </Link>
              </RoleBasedAccess>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && isApproved ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-ocean-50 transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-left">
                    <span className="text-sm font-medium text-gray-700 block">{user?.name}</span>
                    <RoleBadge role={user?.role} size="xs" />
                  </div>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <SafeIcon icon={FiUser} className="text-sm" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <SafeIcon icon={FiSettings} className="text-sm" />
                        <span>Settings</span>
                      </Link>
                      <RoleBasedAccess permissions={[PERMISSIONS.MANAGE_USERS]}>
                        <Link
                          to="/user-management"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <SafeIcon icon={FiShield} className="text-sm" />
                          <span>User Management</span>
                        </Link>
                      </RoleBasedAccess>
                      <RoleBasedAccess permissions={[PERMISSIONS.MANAGE_USERS]}>
                        <Link
                          to="/role-management"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <SafeIcon icon={FiShield} className="text-sm" />
                          <span>Role Management</span>
                        </Link>
                      </RoleBasedAccess>
                      <RoleBasedAccess permissions={[PERMISSIONS.MANAGE_APPLICATIONS]}>
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <SafeIcon icon={FiSettings} className="text-sm" />
                          <span>Admin Panel</span>
                        </Link>
                      </RoleBasedAccess>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <SafeIcon icon={FiLogOut} className="text-sm" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button className="text-sm font-medium text-gray-600 hover:text-ocean-600 transition-colors">
                  Sign In
                </button>
                <button className="bg-ocean-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ocean-700 transition-colors">
                  Apply for Membership
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-ocean-600 hover:bg-ocean-50"
          >
            <SafeIcon icon={isMobileMenuOpen ? FiX : FiMenu} className="text-xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <RoleBasedAccess key={item.name} permissions={item.permissions || []}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-ocean-100 text-ocean-700'
                        : 'text-gray-600 hover:text-ocean-600 hover:bg-ocean-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <SafeIcon icon={item.icon} className="text-sm" />
                    <span>{item.name}</span>
                  </Link>
                </RoleBasedAccess>
              ))}
              {isAuthenticated && isApproved && (
                <>
                  <hr className="my-2" />
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-ocean-600 hover:bg-ocean-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <SafeIcon icon={FiUser} className="text-sm" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <SafeIcon icon={FiLogOut} className="text-sm" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;