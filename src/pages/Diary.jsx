import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiCalendar, FiTag, FiSmile, FiPlus, FiTrash2, FiSave, FiX } = FiIcons;

const Diary = () => {
  const { diaryEntries, addDiaryEntry } = useApp();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    content: '',
    mood: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');

  const moodOptions = [
    { label: 'Excited', value: 'excited', color: 'yellow' },
    { label: 'Calm', value: 'calm', color: 'blue' },
    { label: 'Focused', value: 'focused', color: 'green' },
    { label: 'Nervous', value: 'nervous', color: 'orange' },
    { label: 'Confident', value: 'confident', color: 'purple' },
    { label: 'Tired', value: 'tired', color: 'gray' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditorChange = (content) => {
    setNewEntry(prev => ({
      ...prev,
      content
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '' && !newEntry.tags.includes(newTag.trim())) {
      setNewEntry(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addDiaryEntry(newEntry);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      title: '',
      content: '',
      mood: '',
      tags: []
    });
    setShowNewEntry(false);
  };

  const getMoodColor = (mood) => {
    const foundMood = moodOptions.find(option => option.value === mood);
    return foundMood ? foundMood.color : 'gray';
  };

  // Example diary entries (would come from context in real app)
  const mockDiaryEntries = [
    {
      id: '1',
      date: '2024-05-20',
      title: 'First Deep Dive Experience',
      content: '<p>Today I reached -20m for the first time! The feeling of accomplishment was incredible. I noticed my equalization was much smoother after practicing the Frenzel technique all week. The visibility was amazing and I spotted a school of barracudas circling below me.</p><p>I need to work on my relaxation during the descent, as I still feel some tension in my shoulders. My instructor suggested more stretching exercises before the dive.</p>',
      mood: 'excited',
      tags: ['Personal Best', 'FIM', 'Technique']
    },
    {
      id: '2',
      date: '2024-05-18',
      title: 'Static Apnea Breakthrough',
      content: '<p>Finally broke the 4-minute barrier in static apnea! The meditation techniques I have been practicing really helped me stay calm and manage contractions better. I found that focusing on my heartbeat helped me enter a deeper state of relaxation.</p><p>I noticed that my recovery breathing has improved significantly. I felt clear-headed almost immediately after the breath-hold.</p>',
      mood: 'confident',
      tags: ['Static Apnea', 'Meditation', 'Breath-hold']
    },
    {
      id: '3',
      date: '2024-05-15',
      title: 'Pre-competition Thoughts',
      content: '<p>One week before my first competition and I am feeling a mix of excitement and nervousness. I have been visualizing my dives each night before sleep, which seems to help with the anxiety.</p><p>My coach suggested focusing on consistency rather than pushing for a personal best during the competition. The goal is to execute clean dives with good technique rather than maximal performance.</p>',
      mood: 'nervous',
      tags: ['Competition', 'Mental Preparation', 'Goals']
    }
  ];

  const displayedEntries = diaryEntries.length > 0 ? diaryEntries : mockDiaryEntries;

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Freediving Journal</h1>
            <p className="text-gray-600">
              Document your thoughts, experiences, and progress in your freediving journey
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewEntry(true)}
            className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} />
            <span>New Entry</span>
          </motion.button>
        </motion.div>

        {/* Journal Entries */}
        <div className="space-y-6">
          {displayedEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className={`bg-${getMoodColor(entry.mood)}-100 px-6 py-4 border-b border-${getMoodColor(entry.mood)}-200`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-${getMoodColor(entry.mood)}-500 flex items-center justify-center`}>
                      <SafeIcon icon={FiSmile} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{entry.title}</h2>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <SafeIcon icon={FiCalendar} className="text-gray-400" />
                        <span>{entry.date}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${getMoodColor(entry.mood)}-200 text-${getMoodColor(entry.mood)}-800`}>
                          {moodOptions.find(m => m.value === entry.mood)?.label || 'Neutral'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <SafeIcon icon={FiEdit3} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: entry.content }}></div>
                
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {entry.tags.map((tag, i) => (
                      <span key={i} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                        <SafeIcon icon={FiTag} className="text-gray-500 text-xs" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
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
                  <h2 className="text-2xl font-bold text-gray-900">New Journal Entry</h2>
                  <button
                    onClick={() => setShowNewEntry(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} className="text-xl text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <SafeIcon icon={FiEdit3} className="inline mr-2" />
                        Entry Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={newEntry.title}
                        onChange={handleInputChange}
                        placeholder="Give your entry a title..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        required
                      />
                    </div>

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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <SafeIcon icon={FiSmile} className="inline mr-2" />
                      How are you feeling today?
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {moodOptions.map((mood) => (
                        <button
                          key={mood.value}
                          type="button"
                          onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.value }))}
                          className={`py-2 rounded-lg border ${
                            newEntry.mood === mood.value 
                              ? `bg-${mood.color}-100 border-${mood.color}-300 text-${mood.color}-800` 
                              : 'border-gray-200 hover:bg-gray-50'
                          } transition-colors`}
                        >
                          {mood.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Journal Content
                    </label>
                    <textarea
                      name="content"
                      value={newEntry.content}
                      onChange={handleInputChange}
                      rows={8}
                      placeholder="Write about your freediving experience, thoughts, observations..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <SafeIcon icon={FiTag} className="inline mr-2" />
                      Tags
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tags..."
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors"
                      >
                        <SafeIcon icon={FiPlus} />
                      </button>
                    </div>
                    {newEntry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newEntry.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium flex items-center space-x-1">
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(index)}
                              className="text-gray-500 hover:text-red-500 ml-1"
                            >
                              <SafeIcon icon={FiX} className="text-xs" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

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
                      <span>Save Entry</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Journal Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Journal Insights</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-ocean-50 to-ocean-100 rounded-xl p-5">
              <h3 className="font-semibold text-ocean-900 mb-3">Most Common Mood</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-ocean-500 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiSmile} className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-ocean-900">Confident</p>
                  <p className="text-sm text-ocean-700">You feel most confident before your dives</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
              <h3 className="font-semibold text-green-900 mb-3">Most Used Tags</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white text-green-800 px-2 py-1 rounded text-sm font-medium">Technique</span>
                <span className="bg-white text-green-800 px-2 py-1 rounded text-sm font-medium">FIM</span>
                <span className="bg-white text-green-800 px-2 py-1 rounded text-sm font-medium">Breath-hold</span>
                <span className="bg-white text-green-800 px-2 py-1 rounded text-sm font-medium">Meditation</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5">
              <h3 className="font-semibold text-purple-900 mb-3">Journal Activity</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiEdit3} className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900">3 Entries</p>
                  <p className="text-sm text-purple-700">This month</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reflection Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Reflection Prompts</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-ocean-50 p-4 rounded-lg">
              <h3 className="font-semibold text-ocean-900 mb-2">Pre-Dive Reflection</h3>
              <p className="text-ocean-700 text-sm">What are your intentions for this dive? What are you hoping to learn or experience?</p>
            </div>
            
            <div className="bg-ocean-50 p-4 rounded-lg">
              <h3 className="font-semibold text-ocean-900 mb-2">Post-Dive Analysis</h3>
              <p className="text-ocean-700 text-sm">What went well? What could be improved? How did your body respond?</p>
            </div>
            
            <div className="bg-ocean-50 p-4 rounded-lg">
              <h3 className="font-semibold text-ocean-900 mb-2">Technique Focus</h3>
              <p className="text-ocean-700 text-sm">Which techniques are working best for you? Where do you need more practice?</p>
            </div>
            
            <div className="bg-ocean-50 p-4 rounded-lg">
              <h3 className="font-semibold text-ocean-900 mb-2">Mental State</h3>
              <p className="text-ocean-700 text-sm">How does your mental state affect your freediving? What helps you stay focused?</p>
            </div>
            
            <div className="bg-ocean-50 p-4 rounded-lg">
              <h3 className="font-semibold text-ocean-900 mb-2">Goal Review</h3>
              <p className="text-ocean-700 text-sm">Are you making progress toward your freediving goals? Do they need adjustment?</p>
            </div>
            
            <div className="bg-ocean-50 p-4 rounded-lg">
              <h3 className="font-semibold text-ocean-900 mb-2">Connection to Water</h3>
              <p className="text-ocean-700 text-sm">How does being in the water make you feel? What draws you to freediving?</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Diary;