import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiCalendar, FiMapPin, FiUsers, FiClipboard, FiTool, FiAlertTriangle, FiPhone, FiSun, FiDroplet, FiWind, FiThermometer, FiEdit, FiTrash2, FiSave, FiX, FiEye } = FiIcons;

const DivePlanner = () => {
  const { divePlans, addDivePlan } = useApp();
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: '',
    location: '',
    date: '',
    description: '',
    diveSiteDetails: '',
    weatherConditions: '',
    equipmentList: [],
    participants: [],
    emergencyContacts: []
  });
  const [newEquipment, setNewEquipment] = useState('');
  const [newParticipant, setNewParticipant] = useState('');
  const [newEmergencyContact, setNewEmergencyContact] = useState('');

  // Mock weather data
  const weatherForecast = [
    { day: 'Today', temperature: '25°C', conditions: 'Sunny', windSpeed: '5 km/h', waveHeight: '0.5m', visibility: '20m' },
    { day: 'Tomorrow', temperature: '24°C', conditions: 'Partly Cloudy', windSpeed: '8 km/h', waveHeight: '0.7m', visibility: '15m' },
    { day: 'Day 3', temperature: '26°C', conditions: 'Sunny', windSpeed: '3 km/h', waveHeight: '0.3m', visibility: '25m' },
    { day: 'Day 4', temperature: '23°C', conditions: 'Cloudy', windSpeed: '12 km/h', waveHeight: '1.0m', visibility: '10m' },
    { day: 'Day 5', temperature: '22°C', conditions: 'Light Rain', windSpeed: '15 km/h', waveHeight: '1.2m', visibility: '8m' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEquipment = () => {
    if (newEquipment.trim() !== '') {
      setNewPlan(prev => ({
        ...prev,
        equipmentList: [...prev.equipmentList, newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  const handleAddParticipant = () => {
    if (newParticipant.trim() !== '') {
      setNewPlan(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant.trim()]
      }));
      setNewParticipant('');
    }
  };

  const handleAddEmergencyContact = () => {
    if (newEmergencyContact.trim() !== '') {
      setNewPlan(prev => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, newEmergencyContact.trim()]
      }));
      setNewEmergencyContact('');
    }
  };

  const handleRemoveItem = (array, index) => {
    setNewPlan(prev => ({
      ...prev,
      [array]: prev[array].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addDivePlan(newPlan);
    setNewPlan({
      title: '',
      location: '',
      date: '',
      description: '',
      diveSiteDetails: '',
      weatherConditions: '',
      equipmentList: [],
      participants: [],
      emergencyContacts: []
    });
    setShowNewPlan(false);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dive Trip Planner</h1>
            <p className="text-gray-600">
              Plan and organize your freediving trips with all essential details
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewPlan(true)}
            className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} />
            <span>New Dive Plan</span>
          </motion.button>
        </motion.div>

        {/* Weather Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Weather Forecast</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {weatherForecast.map((day, index) => (
              <div key={index} className="weather-widget rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{day.day}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiThermometer} className="text-red-500" />
                    <span>{day.temperature}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiSun} className="text-yellow-500" />
                    <span>{day.conditions}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiWind} className="text-blue-500" />
                    <span>{day.windSpeed}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiDroplet} className="text-blue-500" />
                    <span>Waves: {day.waveHeight}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiEye} className="text-green-500" />
                    <span>Vis: {day.visibility}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Existing Dive Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Dive Plans</h2>
          
          {divePlans && divePlans.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {divePlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover-lift"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCalendar} className="text-ocean-500" />
                      <span>{plan.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiMapPin} className="text-ocean-500" />
                      <span>{plan.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiUsers} className="text-ocean-500" />
                      <span>{plan.participants?.length || 0} Participants</span>
                    </div>
                  </div>
                  
                  {plan.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>
                  )}
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-ocean-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-ocean-700 transition-colors">
                      View Details
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <SafeIcon icon={FiEdit} className="text-gray-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg p-12 text-center"
            >
              <SafeIcon icon={FiMapPin} className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No dive plans yet</h3>
              <p className="text-gray-600 mb-6">Start planning your next freediving adventure!</p>
              <button
                onClick={() => setShowNewPlan(true)}
                className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
              >
                Create Your First Dive Plan
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Dive Site Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Dive Sites</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Blue Hole, Dahab */}
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop"
                alt="Blue Hole, Dahab"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">Blue Hole, Dahab</h3>
                <p className="text-gray-600 text-sm mb-2">Egypt</p>
                <div className="flex justify-between text-sm">
                  <span className="text-ocean-600">Max Depth: 100m+</span>
                  <span className="text-gray-500">Advanced</span>
                </div>
              </div>
            </div>
            
            {/* Dean's Blue Hole */}
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"
                alt="Dean's Blue Hole"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">Dean's Blue Hole</h3>
                <p className="text-gray-600 text-sm mb-2">Bahamas</p>
                <div className="flex justify-between text-sm">
                  <span className="text-ocean-600">Max Depth: 202m</span>
                  <span className="text-gray-500">All Levels</span>
                </div>
              </div>
            </div>
            
            {/* Barracuda Lake */}
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1551244072-5d11b96f9abb?w=600&h=400&fit=crop"
                alt="Barracuda Lake"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">Barracuda Lake</h3>
                <p className="text-gray-600 text-sm mb-2">Philippines</p>
                <div className="flex justify-between text-sm">
                  <span className="text-ocean-600">Max Depth: 30m</span>
                  <span className="text-gray-500">Intermediate</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* New Plan Modal */}
        {showNewPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewPlan(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Create New Dive Plan</h2>
                <button
                  onClick={() => setShowNewPlan(false)}
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
                      Plan Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newPlan.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Weekend Blue Hole Trip"
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
                      value={newPlan.date}
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
                    value={newPlan.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Blue Hole, Dahab, Egypt"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newPlan.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Brief description of the dive trip..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>

                {/* Dive Site Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiClipboard} className="inline mr-2" />
                    Dive Site Details
                  </label>
                  <textarea
                    name="diveSiteDetails"
                    value={newPlan.diveSiteDetails}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Entry/exit points, depth information, underwater features..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>

                {/* Weather Conditions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiSun} className="inline mr-2" />
                    Expected Weather Conditions
                  </label>
                  <textarea
                    name="weatherConditions"
                    value={newPlan.weatherConditions}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Temperature, wind, visibility, currents..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>

                {/* Equipment List */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiTool} className="inline mr-2" />
                    Equipment List
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newEquipment}
                      onChange={(e) => setNewEquipment(e.target.value)}
                      placeholder="Add equipment item..."
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEquipment())}
                    />
                    <button
                      type="button"
                      onClick={handleAddEquipment}
                      className="bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors"
                    >
                      <SafeIcon icon={FiPlus} />
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 max-h-40 overflow-y-auto">
                    {newPlan.equipmentList.length > 0 ? (
                      newPlan.equipmentList.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-2 rounded">
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem('equipmentList', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <SafeIcon icon={FiTrash2} className="text-sm" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-2">No equipment added yet</p>
                    )}
                  </div>
                </div>

                {/* Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiUsers} className="inline mr-2" />
                    Participants
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newParticipant}
                      onChange={(e) => setNewParticipant(e.target.value)}
                      placeholder="Add participant name..."
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddParticipant())}
                    />
                    <button
                      type="button"
                      onClick={handleAddParticipant}
                      className="bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors"
                    >
                      <SafeIcon icon={FiPlus} />
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 max-h-40 overflow-y-auto">
                    {newPlan.participants.length > 0 ? (
                      newPlan.participants.map((participant, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-2 rounded">
                          <span>{participant}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem('participants', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <SafeIcon icon={FiTrash2} className="text-sm" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-2">No participants added yet</p>
                    )}
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiPhone} className="inline mr-2" />
                    Emergency Contacts
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newEmergencyContact}
                      onChange={(e) => setNewEmergencyContact(e.target.value)}
                      placeholder="Add emergency contact info..."
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmergencyContact())}
                    />
                    <button
                      type="button"
                      onClick={handleAddEmergencyContact}
                      className="bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors"
                    >
                      <SafeIcon icon={FiPlus} />
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 max-h-40 overflow-y-auto">
                    {newPlan.emergencyContacts.length > 0 ? (
                      newPlan.emergencyContacts.map((contact, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-2 rounded">
                          <span>{contact}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem('emergencyContacts', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <SafeIcon icon={FiTrash2} className="text-sm" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-2">No emergency contacts added yet</p>
                    )}
                  </div>
                </div>

                {/* Safety Reminder */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiAlertTriangle} className="text-xl text-yellow-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-yellow-800 mb-1">Safety First</h3>
                      <p className="text-yellow-700 text-sm">
                        Always dive with a buddy, follow proper freediving protocols, and ensure all participants are aware of emergency procedures.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewPlan(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiSave} />
                    <span>Save Dive Plan</span>
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

export default DivePlanner;