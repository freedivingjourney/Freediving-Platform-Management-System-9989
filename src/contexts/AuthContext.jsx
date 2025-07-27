import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('freediving_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Simulate login process with role assignment
    let mockUser;

    // Assign roles based on email for demo purposes
    if (email.includes('admin')) {
      mockUser = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin',
        status: 'approved',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        certifications: ['System Administrator'],
        personalBests: {
          depth: -30,
          static: '5:00',
          dynamic: 100
        },
        humanDesignType: 'Manifestor',
        joinDate: '2024-01-01'
      };
    } else if (email.includes('instructor')) {
      mockUser = {
        id: '2',
        email,
        name: 'Sarah Johnson',
        role: 'instructor',
        status: 'approved',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        certifications: ['AIDA Master Instructor', 'SSI Level 3'],
        personalBests: {
          depth: -40,
          static: '6:00',
          dynamic: 120
        },
        humanDesignType: 'Generator',
        joinDate: '2024-01-15'
      };
    } else if (email.includes('student')) {
      mockUser = {
        id: '3',
        email,
        name: 'Student User',
        role: 'student',
        status: 'approved',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        certifications: ['AIDA 2', 'Molchanovs Wave 1'],
        personalBests: {
          depth: -25,
          static: '4:30',
          dynamic: 75
        },
        humanDesignType: 'Projector',
        joinDate: '2024-02-01'
      };
    } else {
      mockUser = {
        id: '4',
        email,
        name: 'Alex Rivera',
        role: 'member',
        status: 'approved',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        certifications: ['AIDA 1'],
        personalBests: {
          depth: -15,
          static: '3:30',
          dynamic: 50
        },
        humanDesignType: 'Reflector',
        joinDate: '2024-03-01'
      };
    }

    localStorage.setItem('freediving_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const register = async (userData) => {
    // Simulate registration process
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      status: 'pending',
      role: 'member', // Default role for new users
      joinDate: new Date().toISOString().split('T')[0]
    };

    // Don't set user yet - they need approval
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('freediving_user');
    setUser(null);
  };

  const updateUserRole = (newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      localStorage.setItem('freediving_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUserRole,
    loading,
    isAuthenticated: !!user,
    isApproved: user?.status === 'approved'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};