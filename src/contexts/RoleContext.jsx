import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Define role hierarchy and permissions
const ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
  MEMBER: 'member'
};

const PERMISSIONS = {
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_APPLICATIONS: 'manage_applications',
  MANAGE_SYSTEM: 'manage_system',
  VIEW_ALL_DATA: 'view_all_data',
  MODERATE_CONTENT: 'moderate_content',
  
  // Instructor permissions
  CREATE_COURSES: 'create_courses',
  MANAGE_STUDENTS: 'manage_students',
  VIEW_STUDENT_PROGRESS: 'view_student_progress',
  APPROVE_CERTIFICATIONS: 'approve_certifications',
  CREATE_EVENTS: 'create_events',
  
  // Student/Member permissions
  LOG_DIVES: 'log_dives',
  SET_GOALS: 'set_goals',
  JOIN_EVENTS: 'join_events',
  ACCESS_COMMUNITY: 'access_community',
  VIEW_COURSES: 'view_courses',
  BOOK_SESSIONS: 'book_sessions',
  
  // General permissions
  VIEW_PROFILE: 'view_profile',
  EDIT_PROFILE: 'edit_profile',
  CONTACT_SUPPORT: 'contact_support'
};

const ROLE_PERMISSIONS = {
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

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();
  
  const getUserRole = () => {
    return user?.role || ROLES.MEMBER;
  };

  const hasPermission = (permission) => {
    const userRole = getUserRole();
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    return rolePermissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };

  const isAdmin = () => {
    return getUserRole() === ROLES.ADMIN;
  };

  const isInstructor = () => {
    return getUserRole() === ROLES.INSTRUCTOR;
  };

  const isStudent = () => {
    return getUserRole() === ROLES.STUDENT;
  };

  const isMember = () => {
    return getUserRole() === ROLES.MEMBER;
  };

  const canAccessRoute = (routePermissions) => {
    if (!routePermissions || routePermissions.length === 0) {
      return true; // Public route
    }
    return hasAnyPermission(routePermissions);
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      [ROLES.ADMIN]: 'Administrator',
      [ROLES.INSTRUCTOR]: 'Instructor',
      [ROLES.STUDENT]: 'Student',
      [ROLES.MEMBER]: 'Community Member'
    };
    return roleNames[role] || 'Member';
  };

  const getRoleColor = (role) => {
    const roleColors = {
      [ROLES.ADMIN]: 'red',
      [ROLES.INSTRUCTOR]: 'purple',
      [ROLES.STUDENT]: 'blue',
      [ROLES.MEMBER]: 'green'
    };
    return roleColors[role] || 'gray';
  };

  const value = {
    ROLES,
    PERMISSIONS,
    user,
    getUserRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isInstructor,
    isStudent,
    isMember,
    canAccessRoute,
    getRoleDisplayName,
    getRoleColor
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export { ROLES, PERMISSIONS };