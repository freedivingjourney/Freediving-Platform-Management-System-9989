import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [diveLog, setDiveLog] = useState([]);
  const [goals, setGoals] = useState([]);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [divePlans, setDivePlans] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Mock data initialization
  React.useEffect(() => {
    const mockDives = [
      {
        id: '1',
        date: '2024-01-20',
        time: '09:30',
        location: 'Blue Hole, Cyprus',
        primaryCategory: 'Line/Depth Training',
        disciplineCategory: 'Open Water Discipline',
        disciplineSubCategory: 'FIM (Free Immersion)',
        depth: -22,
        instructor: 'Sarah Johnson',
        diveBuddy: 'Mike Chen',
        experience: 'Amazing',
        weatherCondition: 'Sunny',
        waveCondition: 'Calm',
        waterCurrent: 'Minimal',
        waterVisibility: -30,
        notes: 'Great session focusing on equalization technique.'
      },
      {
        id: '2',
        date: '2024-01-18',
        time: '14:00',
        location: 'Local Pool',
        primaryCategory: 'Pool Training',
        disciplineCategory: 'Pool (Confined Water) Discipline',
        disciplineSubCategory: 'STA (Static Apnea)',
        time_duration: '4:15',
        instructor: 'David Park',
        diveBuddy: 'Emma Wilson',
        experience: 'Good',
        notes: 'Personal best in static apnea! Focused on relaxation.'
      }
    ];

    const mockGoals = [
      {
        id: '1',
        title: 'Reach 30m depth in FIM',
        category: 'Training Goals',
        targetValue: 30,
        currentValue: 22,
        unit: 'meters',
        deadline: '2024-06-01',
        status: 'in-progress',
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=200&fit=crop'
      },
      {
        id: '2',
        title: 'Complete AIDA 3 Certification',
        category: 'Certification Pathways',
        targetValue: 1,
        currentValue: 0.7,
        unit: 'completion',
        deadline: '2024-05-15',
        status: 'in-progress',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop'
      }
    ];

    setDiveLog(mockDives);
    setGoals(mockGoals);
  }, []);

  const addDiveEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      date: entry.date || new Date().toISOString().split('T')[0]
    };
    setDiveLog(prev => [newEntry, ...prev]);
  };

  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
      status: 'in-progress',
      currentValue: 0
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoal = (goalId, updates) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  };

  const addDiaryEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      date: entry.date || new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };
    setDiaryEntries(prev => [newEntry, ...prev]);
  };

  const addDivePlan = (plan) => {
    const newPlan = {
      ...plan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setDivePlans(prev => [newPlan, ...prev]);
  };

  const value = {
    diveLog,
    goals,
    diaryEntries,
    divePlans,
    notifications,
    addDiveEntry,
    addGoal,
    updateGoal,
    addDiaryEntry,
    addDivePlan,
    setNotifications
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};