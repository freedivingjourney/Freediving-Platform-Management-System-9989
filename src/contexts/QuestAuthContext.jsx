import React, { createContext, useContext, useState, useEffect } from 'react';

const QuestAuthContext = createContext();

export const useQuestAuth = () => {
  const context = useContext(QuestAuthContext);
  if (!context) {
    throw new Error('useQuestAuth must be used within a QuestAuthProvider');
  }
  return context;
};

export const QuestAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const checkAuth = () => {
      const userId = localStorage.getItem('quest_userId');
      const token = localStorage.getItem('quest_token');
      
      if (userId && token) {
        setCurrentUser({ userId, token });
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = ({ userId, token, newUser }) => {
    localStorage.setItem('quest_userId', userId);
    localStorage.setItem('quest_token', token);
    
    setCurrentUser({ userId, token });
    setIsAuthenticated(true);
    
    return { userId, token, newUser };
  };

  const handleLogout = () => {
    localStorage.removeItem('quest_userId');
    localStorage.removeItem('quest_token');
    
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    currentUser,
    loading,
    handleLogin,
    handleLogout
  };

  return (
    <QuestAuthContext.Provider value={value}>
      {children}
    </QuestAuthContext.Provider>
  );
};