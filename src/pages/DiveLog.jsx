import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiActivity, FiPlus, FiSearch, FiFilter, FiCalendar, FiMapPin, FiUser, FiClock, FiTrendingDown, FiTarget, FiEdit3, FiCamera, FiX, FiSave } = FiIcons;

const DiveLog = () => {
  const { diveLog, addDiveEntry } = useApp();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    location: '',
    primaryCategory: '',
    disciplineCategory: '',
    disciplineSubCategory: '',
    depth: '',
    distance: '',
    time_duration: '',
    numberOfFreedivers: '',
    numberOfStudents: '',
    numberOfModels: '',
    instructor: '',
    diveBuddy: '',
    experience: '',
    weatherCondition: '',
    waveCondition: '',
    waterCurrent: '',
    waterVisibility: '',
    notes: ''
  });

  // Define the category structure
  const primaryCategories = {
    'Discovery Freediving (Intro)': {
      disciplineCategories: ['Open Water Discipline', 'Pool (Confined Water) Discipline'],
      subCategories: ['Discovery Wave', 'FIM (Free Immersion)', 'CWTB (Constant Weight Bi-Fins)', 'STA (Static Apnea)']
    },
    'City Freediving (Intro)': {
      disciplineCategories: ['Open Water Discipline', 'Pool (Confined Water) Discipline'],
      subCategories: ['Discovery Wave', 'FIM (Free Immersion)', 'CWTB (Constant Weight Bi-Fins)', 'STA (Static Apnea)']
    },
    'Practice Dive (Refresher)': {
      disciplineCategories: ['Open Water Discipline', 'Pool (Confined Water) Discipline'],
      subCategories: ['FIM (Free Immersion)', 'CWTB (Constant Weight Bi-Fins)', 'STA (Static Apnea)']
    },
    'Fun Dive': {
      disciplineCategories: ['Open Water Discipline', 'Pool (Confined Water) Discipline'],
      subCategories: ['FIM (Free Immersion)', 'CWTB (Constant Weight Bi-Fins)', 'OW Performing Arts (Aura)', 'Pool Performing Arts (Aura)', 'Freediving Adventure']
    },
    'Pool Training': {
      disciplineCategories: ['Pool (Confined Water) Discipline'],
      subCategories: ['Discovery Pool', 'STA (Static Apnea)', 'DYN (Dynamic With Fins)', 'DYNB (Dynamic With Bi-Fins)', 'DNF (Dynamic No Fins)', 'Pool Safety & Rescue']
    },
    'Line/Depth Training': {
      disciplineCategories: ['Open Water Discipline'],
      subCategories: ['FIM (Free Immersion)', 'CWTB (Constant Weight Bi-Fins)', 'CWT (Constant Weight)', 'CNF (Constant Weight No Fins)', 'OW Safety & Rescue']
    },
    'Dry Training': {
      disciplineCategories: ['Dry Discipline'],
      subCategories: ['Dry STA (Static Apnea)', 'Apnea Walk', 'Apnea Squat']
    },
    'Freediving Certifications': {
      disciplineCategories: ['Open Water Discipline', 'Pool (Confined Water) Discipline'],
      subCategories: ['FIM (Free Immersion)', 'CWTB (Constant Weight Bi-Fins)', 'CWT (Constant Weight)', 'CNF (Constant Weight No Fins)', 'OW Safety & Rescue', 'STA (Static Apnea)', 'DYN (Dynamic With Fins)', 'DYNB (Dynamic With Bi-Fins)', 'DNF (Dynamic No Fins)', 'Pool Safety & Rescue']
    },
    'Freediving Competitions': {
      disciplineCategories: ['Open Water Discipline', 'Pool (Confined Water) Discipline'],
      subCategories: ['FIM (Free Immersion)', 'CWTB (Constant Weight Bi-Fins)', 'CWT (Constant Weight)', 'CNF (Constant Weight No Fins)', 'OW Safety & Rescue', 'STA (Static Apnea)', 'DYN (Dynamic With Fins)', 'DYNB (Dynamic With Bi-Fins)', 'DNF (Dynamic No Fins)', 'Pool Safety & Rescue', 'Pool Judge', 'OW Judge']
    },
    'Mermaiding': {
      disciplineCategories: ['Open Water Discipline', 'Pool (Confined Water) Discipline'],
      subCategories: ['Basic Mermaid', 'Advanced Mermaid', 'OW Performing Arts (Aura)', 'Pool Performing Arts (Aura)']
    },
    'UW Performing Arts and Creatives': {
      disciplineCategories: ['Open Water Discipline', 'Pool (Confined Water) Discipline'],
      subCategories: ['OW Performing Arts (Aura)', 'Pool Performing Arts (Aura)', 'OW Creatives (Photo/Video)', 'Pool Creatives (Photo/Video)']
    },
    'Coaching': {
      disciplineCategories: ['Open Water Discipline', 'Pool (Confined Water) Discipline'],
      subCategories: ['FIM (Free Immersion)', 'CWTB (Constant Weight Bi-Fins)', 'CWT (Constant Weight)', 'CNF (Constant Weight No Fins)', 'OW Safety & Rescue', 'STA (Static Apnea)', 'DYN (Dynamic With Fins)', 'DYNB (Dynamic With Bi-Fins)', 'DNF (Dynamic No Fins)', 'Pool Safety & Rescue']
    },
    'Mermaiding Certifications': {
      disciplineCategories: ['Open Water Discipline', 'Pool (Confined Water) Discipline'],
      subCategories: ['Basic Mermaid', 'Advanced Mermaid']
    }
  };

  // Helper function to determine which fields to show based on discipline
  const getRequiredFields = (subCategory) => {
    const depthDisciplines = ['Discovery Wave', 'FIM (Free Immersion)', 'CWTB (Constant Weight Bi-Fins)', 'CWT (Constant Weight)', 'CNF (Constant Weight No Fins)', 'OW Safety & Rescue', 'OW Creatives (Photo/Video)', 'OW Performing Arts (Aura)', 'Freediving Adventure', 'Basic Mermaid', 'Advanced Mermaid', 'Pool Creatives (Photo/Video)', 'Pool Performing Arts (Aura)'];
    
    const distanceDisciplines = ['DYN (Dynamic With Fins)', 'DYNB (Dynamic With Bi-Fins)', 'DNF (Dynamic No Fins)', 'Pool Safety & Rescue'];
    
    const timeDisciplines = ['STA (Static Apnea)', 'Dry STA (Static Apnea)', 'Apnea Walk', 'Apnea Squat'];
    
    const safetyDisciplines = ['OW Safety & Rescue', 'Pool Safety & Rescue'];
    
    const judgeDisciplines = ['Pool Judge', 'OW Judge'];
    
    const coachingDisciplines = ['Coaching', 'Freediving Certifications', 'Mermaiding Certifications'];
    
    const creativesDisciplines = ['OW Creatives (Photo/Video)', 'Pool Creatives (Photo/Video)'];

    return {
      showDepth: depthDisciplines.includes(subCategory),
      showDistance: distanceDisciplines.includes(subCategory),
      showTime: timeDisciplines.includes(subCategory),
      showSafety: safetyDisciplines.includes(subCategory),
      showJudge: judgeDisciplines.includes(subCategory),
      showStudents: coachingDisciplines.includes(subCategory),
      showModels: creativesDisciplines.includes(subCategory)
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addDiveEntry(newEntry);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      location: '',
      primaryCategory: '',
      disciplineCategory: '',
      disciplineSubCategory: '',
      depth: '',
      distance: '',
      time_duration: '',
      numberOfFreedivers: '',
      numberOfStudents: '',
      numberOfModels: '',
      instructor: '',
      diveBuddy: '',
      experience: '',
      weatherCondition: '',
      waveCondition: '',
      waterCurrent: '',
      waterVisibility: '',
      notes: ''
    });
    setShowNewEntry(false);
  };

  const filteredDives = diveLog.filter(dive => {
    const matchesSearch = dive.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dive.disciplineSubCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dive.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterCategory === 'all' || dive.primaryCategory === filterCategory;
    
    return matchesSearch && matchesFilter;
  });

  const requiredFields = getRequiredFields(newEntry.disciplineSubCategory);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Dive Log</h1>
            <p className="text-gray-600">Track and manage your freediving sessions</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewEntry(true)}
            className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} />
            <span>Log New Dive</span>
          </motion.button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search dives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Categories</option>
                {Object.keys(primaryCategories).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiActivity} />
              <span className="font-medium">{filteredDives.length} dives logged</span>
            </div>
          </div>
        </motion.div>

        {/* Dive Entries */}
        <div className="space-y-6">
          {filteredDives.length > 0 ? filteredDives.map((dive, index) => (
            <motion.div
              key={dive.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover-lift"
            >
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-ocean-100 rounded-lg flex items-center justify-center">
                      <SafeIcon icon={FiActivity} className="text-2xl text-ocean-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{dive.disciplineSubCategory}</h3>
                      <p className="text-sm text-gray-600">{dive.primaryCategory}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCalendar} className="text-gray-400" />
                      <span>{dive.date} at {dive.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiMapPin} className="text-gray-400" />
                      <span>{dive.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Performance</h4>
                  <div className="space-y-2 text-sm">
                    {dive.depth && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Depth:</span>
                        <span className="font-medium text-ocean-600">{dive.depth}m</span>
                      </div>
                    )}
                    {dive.distance && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-medium text-ocean-600">{dive.distance}m</span>
                      </div>
                    )}
                    {dive.time_duration && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium text-ocean-600">{dive.time_duration}</span>
                      </div>
                    )}
                    {dive.experience && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className={`font-medium ${
                          dive.experience === 'Amazing' ? 'text-green-600' :
                          dive.experience === 'Good' ? 'text-blue-600' :
                          dive.experience === 'Average' ? 'text-yellow-600' : 'text-red-600'
                        }`}>{dive.experience}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Team</h4>
                  <div className="space-y-2 text-sm">
                    {dive.instructor && (
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiUser} className="text-gray-400" />
                        <span>Instructor: {dive.instructor}</span>
                      </div>
                    )}
                    {dive.diveBuddy && (
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiUser} className="text-gray-400" />
                        <span>Buddy: {dive.diveBuddy}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Conditions</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {dive.weatherCondition && <p>Weather: {dive.weatherCondition}</p>}
                    {dive.waveCondition && <p>Waves: {dive.waveCondition}</p>}
                    {dive.waterCurrent && <p>Current: {dive.waterCurrent}</p>}
                    {dive.waterVisibility && <p>Visibility: {dive.waterVisibility}m</p>}
                  </div>
                </div>
              </div>

              {dive.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-700 text-sm">{dive.notes}</p>
                </div>
              )}
            </motion.div>
          )) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg p-12 text-center"
            >
              <SafeIcon icon={FiActivity} className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No dives logged yet</h3>
              <p className="text-gray-600 mb-6">Start tracking your freediving journey by logging your first dive!</p>
              <button
                onClick={() => setShowNewEntry(true)}
                className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
              >
                Log Your First Dive
              </button>
            </motion.div>
          )}
        </div>

        {/* New Entry Modal */}
        <AnimatePresence>
          {showNewEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowNewEntry(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Log New Dive</h2>
                  <button
                    onClick={() => setShowNewEntry(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} className="text-xl text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <SafeIcon icon={FiCalendar} className="inline mr-2" />
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={newEntry.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <SafeIcon icon={FiClock} className="inline mr-2" />
                        Time
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={newEntry.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <SafeIcon icon={FiMapPin} className="inline mr-2" />
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={newEntry.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Blue Hole, Cyprus"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Categories */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Category
                      </label>
                      <select
                        name="primaryCategory"
                        value={newEntry.primaryCategory}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Primary Category</option>
                        {Object.keys(primaryCategories).map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discipline Category
                      </label>
                      <select
                        name="disciplineCategory"
                        value={newEntry.disciplineCategory}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        required
                        disabled={!newEntry.primaryCategory}
                      >
                        <option value="">Select Discipline Category</option>
                        {newEntry.primaryCategory && primaryCategories[newEntry.primaryCategory]?.disciplineCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discipline Sub-Category
                      </label>
                      <select
                        name="disciplineSubCategory"
                        value={newEntry.disciplineSubCategory}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        required
                        disabled={!newEntry.primaryCategory}
                      >
                        <option value="">Select Sub-Category</option>
                        {newEntry.primaryCategory && primaryCategories[newEntry.primaryCategory]?.subCategories.map(subCategory => (
                          <option key={subCategory} value={subCategory}>{subCategory}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Performance Fields */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {requiredFields.showDepth && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <SafeIcon icon={FiTrendingDown} className="inline mr-2" />
                          Depth (meters, negative values)
                        </label>
                        <input
                          type="number"
                          name="depth"
                          value={newEntry.depth}
                          onChange={handleInputChange}
                          placeholder="e.g., -25"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {requiredFields.showDistance && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <SafeIcon icon={FiTarget} className="inline mr-2" />
                          Distance (meters)
                        </label>
                        <input
                          type="number"
                          name="distance"
                          value={newEntry.distance}
                          onChange={handleInputChange}
                          placeholder="e.g., 75"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {requiredFields.showTime && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <SafeIcon icon={FiClock} className="inline mr-2" />
                          Time (MM:SS)
                        </label>
                        <input
                          type="text"
                          name="time_duration"
                          value={newEntry.time_duration}
                          onChange={handleInputChange}
                          placeholder="e.g., 4:30"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {requiredFields.showSafety && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Freedivers Served
                        </label>
                        <input
                          type="number"
                          name="numberOfFreedivers"
                          value={newEntry.numberOfFreedivers}
                          onChange={handleInputChange}
                          placeholder="e.g., 5"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {requiredFields.showStudents && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Students
                        </label>
                        <input
                          type="number"
                          name="numberOfStudents"
                          value={newEntry.numberOfStudents}
                          onChange={handleInputChange}
                          placeholder="e.g., 3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {requiredFields.showModels && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Models Served
                        </label>
                        <input
                          type="number"
                          name="numberOfModels"
                          value={newEntry.numberOfModels}
                          onChange={handleInputChange}
                          placeholder="e.g., 2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  {/* Team */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <SafeIcon icon={FiUser} className="inline mr-2" />
                        Instructor/Coach
                      </label>
                      <input
                        type="text"
                        name="instructor"
                        value={newEntry.instructor}
                        onChange={handleInputChange}
                        placeholder="e.g., Sarah Johnson"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <SafeIcon icon={FiUser} className="inline mr-2" />
                        Dive Buddy
                      </label>
                      <input
                        type="text"
                        name="diveBuddy"
                        value={newEntry.diveBuddy}
                        onChange={handleInputChange}
                        placeholder="e.g., Mike Chen"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dive Experience (How was your dive?)
                    </label>
                    <select
                      name="experience"
                      value={newEntry.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    >
                      <option value="">Select Experience</option>
                      <option value="Amazing">Amazing</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Challenging">Challenging</option>
                      <option value="Difficult">Difficult</option>
                    </select>
                  </div>

                  {/* Conditions */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weather Condition
                      </label>
                      <select
                        name="weatherCondition"
                        value={newEntry.weatherCondition}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      >
                        <option value="">Select Weather</option>
                        <option value="Sunny">Sunny</option>
                        <option value="Partly Cloudy">Partly Cloudy</option>
                        <option value="Cloudy">Cloudy</option>
                        <option value="Rainy">Rainy</option>
                        <option value="Windy">Windy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wave Condition
                      </label>
                      <select
                        name="waveCondition"
                        value={newEntry.waveCondition}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      >
                        <option value="">Select Wave Condition</option>
                        <option value="Calm">Calm</option>
                        <option value="Small">Small</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Large">Large</option>
                        <option value="Rough">Rough</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Water Current
                      </label>
                      <select
                        name="waterCurrent"
                        value={newEntry.waterCurrent}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      >
                        <option value="">Select Current</option>
                        <option value="None">None</option>
                        <option value="Minimal">Minimal</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Strong">Strong</option>
                        <option value="Very Strong">Very Strong</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Water Visibility (meters)
                      </label>
                      <input
                        type="number"
                        name="waterVisibility"
                        value={newEntry.waterVisibility}
                        onChange={handleInputChange}
                        placeholder="e.g., 30"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <SafeIcon icon={FiEdit3} className="inline mr-2" />
                      Notes & Observations
                    </label>
                    <textarea
                      name="notes"
                      value={newEntry.notes}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Share your thoughts, techniques learned, feelings, or any other observations..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowNewEntry(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <SafeIcon icon={FiSave} />
                      <span>Save Dive Entry</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DiveLog;