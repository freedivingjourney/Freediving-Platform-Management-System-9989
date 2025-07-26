import { useRole } from '../contexts/RoleContext';

const RoleBasedAccess = ({
  permissions = [],
  roles = [],
  children,
  fallback = null,
  requireAll = false
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, getUserRole } = useRole();

  let hasAccess = true;

  // Check role-based access
  if (roles.length > 0) {
    const userRole = getUserRole();
    hasAccess = roles.includes(userRole);
  }

  // Check permission-based access
  if (hasAccess && permissions.length > 0) {
    if (requireAll) {
      hasAccess = hasAllPermissions(permissions);
    } else {
      hasAccess = hasAnyPermission(permissions);
    }
  }

  return hasAccess ? children : fallback;
};

export default RoleBasedAccess;