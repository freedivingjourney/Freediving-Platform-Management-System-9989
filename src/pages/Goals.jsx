import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTarget, FiPlus, FiCalendar, FiTrendingUp, FiCheck, FiEdit, FiTrash2, FiSave, FiX, FiActivity } = FiIcons;

const Goals = () => {
  const { goals, addGoal, updateGoal } = useApp();
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: '',
    targetValue: '',
    currentValue: 0,
    unit: '',
    deadline: '',
    description: '',
    milestones: []
  });
  const [newMilestone, setNewMilestone] = useState('');

  const goalCategories = [
    'Training Goals',
    'Certification Pathways',
    'Personal Bests',
    'Competition Goals',
    'Safety Milestones',
    'Learning Objectives'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMilestone = () => {
    if (newMilestone.trim() !== '') {
      setNewGoal(prev => ({
        ...prev,
        milestones: [...prev.milestones, { text: newMilestone.trim(), completed: false }]
      }));
      setNewMilestone('');
    }
  };

  const handleRemoveMilestone = (index) => {
    setNewGoal(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addGoal(newGoal);
    setNewGoal({
      title: '',
      category: '',
      targetValue: '',
      currentValue: 0,
      unit: '',
      deadline: '',
      description: '',
      milestones: []
    });
    setShowNewGoal(false);
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status) => {
    const colors = {
      'in-progress': 'text-blue-600 bg-blue-100',
      'completed': 'text-green-600 bg-green-100',
      'overdue': 'text-red-600 bg-red-100',
      'paused': 'text-yellow-600 bg-yellow-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Training Goals': 'bg-ocean-50 border-ocean-200 text-ocean-800',
      'Certification Pathways': 'bg-green-50 border-green-200 text-green-800',
      'Personal Bests': 'bg-purple-50 border-purple-200 text-purple-800',
      'Competition Goals': 'bg-red-50 border-red-200 text-red-800',
      'Safety Milestones': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'Learning Objectives': 'bg-indigo-50 border-indigo-200 text-indigo-800'
    };
    return colors[category] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Goals</h1>
            <p className="text-gray-600">
              Track your progress and achieve your freediving objectives
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewGoal(true)}
            className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} />
            <span>New Goal</span>
          </motion.button>
        </motion.div>

        {/* Goals Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <SafeIcon icon={FiTarget} className="text-2xl text-ocean-500" />
              <span className="text-3xl font-bold text-ocean-600">{goals.length}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Goals</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <SafeIcon icon={FiCheck} className="text-2xl text-green-500" />
              <span className="text-3xl font-bold text-green-600">
                {goals.filter(goal => goal.status === 'completed').length}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Completed</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <SafeIcon icon={FiActivity} className="text-2xl text-blue-500" />
              <span className="text-3xl font-bold text-blue-600">
                {goals.filter(goal => goal.status === 'in-progress').length}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">In Progress</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <SafeIcon icon={FiTrendingUp} className="text-2xl text-purple-500" />
              <span className="text-3xl font-bold text-purple-600">
                {Math.round(goals.reduce((acc, goal) => acc + getProgressPercentage(goal.currentValue, goal.targetValue), 0) / goals.length) || 0}%
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Avg Progress</p>
          </div>
        </motion.div>

        {/* Goals Grid */}
        <div className="space-y-6">
          {goals.length > 0 ? (
            goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(goal.category)}`}>
                          {goal.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                          {goal.status?.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      {goal.description && (
                        <p className="text-gray-600 mb-4">{goal.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <SafeIcon icon={FiEdit} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                        <SafeIcon icon={FiTrash2} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-ocean-600 mb-1">
                        {goal.currentValue}
                      </div>
                      <p className="text-sm text-gray-600">Current</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-400 mb-1">
                        {goal.targetValue}
                      </div>
                      <p className="text-sm text-gray-600">Target {goal.unit}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {Math.round(getProgressPercentage(goal.currentValue, goal.targetValue))}%
                      </div>
                      <p className="text-sm text-gray-600">Complete</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>Due: {goal.deadline}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-ocean-500 to-ocean-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(goal.currentValue, goal.targetValue)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Milestones */}
                  {goal.milestones && goal.milestones.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Milestones</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {goal.milestones.map((milestone, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <SafeIcon 
                              icon={milestone.completed ? FiCheck : FiTarget} 
                              className={`${milestone.completed ? 'text-green-500' : 'text-gray-400'}`}
                            />
                            <span className={`text-sm ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                              {milestone.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {goal.image && (
                  <div className="h-48 bg-gray-100">
                    <img 
                      src={goal.image} 
                      alt={goal.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg p-12 text-center"
            >
              <SafeIcon icon={FiTarget} className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No goals set yet</h3>
              <p className="text-gray-600 mb-6">Create your first goal to start tracking your progress!</p>
              <button
                onClick={() => setShowNewGoal(true)}
                className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
              >
                Set Your First Goal
              </button>
            </motion.div>
          )}
        </div>

        {/* New Goal Modal */}
        {showNewGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewGoal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Create New Goal</h2>
                <button
                  onClick={() => setShowNewGoal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-xl text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiTarget} className="inline mr-2" />
                    Goal Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newGoal.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Reach 30m depth in FIM"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={newGoal.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {goalCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <SafeIcon icon={FiCalendar} className="inline mr-2" />
                      Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={newGoal.deadline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Value
                    </label>
                    <input
                      type="number"
                      name="targetValue"
                      value={newGoal.targetValue}
                      onChange={handleInputChange}
                      placeholder="e.g., 30"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={newGoal.unit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Unit</option>
                      <option value="meters">meters</option>
                      <option value="minutes">minutes</option>
                      <option value="seconds">seconds</option>
                      <option value="dives">dives</option>
                      <option value="certifications">certifications</option>
                      <option value="competitions">competitions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Value
                    </label>
                    <input
                      type="number"
                      name="currentValue"
                      value={newGoal.currentValue}
                      onChange={handleInputChange}
                      placeholder="e.g., 22"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={newGoal.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe your goal and why it's important to you..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Milestones (Optional)
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newMilestone}
                      onChange={(e) => setNewMilestone(e.target.value)}
                      placeholder="Add milestone..."
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMilestone())}
                    />
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors"
                    >
                      <SafeIcon icon={FiPlus} />
                    </button>
                  </div>
                  {newGoal.milestones.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      {newGoal.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                          <span className="text-sm">{milestone.text}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMilestone(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <SafeIcon icon={FiTrash2} className="text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewGoal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiSave} />
                    <span>Create Goal</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Goals;