import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiMapPin, FiUsers, FiClock, FiPlus, FiFilter, FiSearch, FiUser, FiDollarSign } = FiIcons;

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const events = [
    {
      id: 1,
      title: 'Weekly Pool Training',
      type: 'Training',
      date: '2024-06-04',
      time: '19:00',
      duration: '2 hours',
      location: 'City Aquatic Center',
      instructor: 'David Park',
      attendees: 12,
      capacity: 15,
      price: 'Free for members',
      description: 'Regular pool training session focusing on static apnea and dynamic techniques.',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=250&fit=crop',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Blue Hole Freediving Weekend',
      type: 'Trip',
      date: '2024-06-15',
      time: '08:00',
      duration: '2 days',
      location: 'Blue Hole, Cyprus',
      instructor: 'Sarah Johnson',
      attendees: 8,
      capacity: 10,
      price: '$150 per person',
      description: 'Exclusive weekend trip to the famous Blue Hole with guided deep dives and safety supervision.',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Freediving Film Night',
      type: 'Social',
      date: '2024-06-22',
      time: '18:30',
      duration: '3 hours',
      location: 'Ocean View Community Center',
      instructor: 'Community Event',
      attendees: 24,
      capacity: 40,
      price: '$10 entry',
      description: 'Watch inspiring freediving documentaries and connect with fellow community members.',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=250&fit=crop',
      status: 'upcoming'
    },
    {
      id: 4,
      title: 'Advanced Equalization Workshop',
      type: 'Workshop',
      date: '2024-06-29',
      time: '10:00',
      duration: '4 hours',
      location: 'FreediveHub Training Center',
      instructor: 'Mike Chen',
      attendees: 6,
      capacity: 8,
      price: '$75 per person',
      description: 'Intensive workshop covering advanced equalization techniques for deeper dives.',
      image: 'https://images.unsplash.com/photo-1551244072-5d11b96f9abb?w=400&h=250&fit=crop',
      status: 'upcoming'
    },
    {
      id: 5,
      title: 'AIDA Competition Prep Course',
      type: 'Competition',
      date: '2024-07-05',
      time: '09:00',
      duration: '5 days',
      location: 'Competition Training Facility',
      instructor: 'Emma Wilson',
      attendees: 4,
      capacity: 6,
      price: '$300 per person',
      description: 'Comprehensive preparation course for upcoming AIDA freediving competitions.',
      image: 'https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=400&h=250&fit=crop',
      status: 'upcoming'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || event.type.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const getEventTypeColor = (type) => {
    const colors = {
      'Training': 'bg-blue-100 text-blue-800',
      'Workshop': 'bg-purple-100 text-purple-800',
      'Trip': 'bg-green-100 text-green-800',
      'Competition': 'bg-red-100 text-red-800',
      'Social': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">
              Join exclusive freediving events, workshops, and community gatherings
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} />
            <span>Create Event</span>
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
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Events</option>
                <option value="training">Training</option>
                <option value="workshop">Workshop</option>
                <option value="trip">Trip</option>
                <option value="competition">Competition</option>
                <option value="social">Social</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiCalendar} />
              <span className="font-medium">{filteredEvents.length} events found</span>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift"
            >
              <div className="relative">
                <img 
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-sm font-medium text-gray-900">{event.price}</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <SafeIcon icon={FiCalendar} className="text-ocean-500" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <SafeIcon icon={FiClock} className="text-ocean-500" />
                    <span>{event.time} ({event.duration})</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <SafeIcon icon={FiMapPin} className="text-ocean-500" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <SafeIcon icon={FiUser} className="text-ocean-500" />
                    <span>Instructor: {event.instructor}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <SafeIcon icon={FiUsers} className="text-ocean-500" />
                    <span>{event.attendees}/{event.capacity} participants</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                    <div 
                      className="bg-ocean-600 h-2 rounded-full" 
                      style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {event.capacity - event.attendees} spots left
                  </span>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors">
                    Register
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Calendar</h2>
          <div className="bg-gray-50 h-80 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <SafeIcon icon={FiCalendar} className="text-4xl text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Interactive calendar would render here</p>
              <p className="text-gray-400 text-sm">Showing all upcoming events and availability</p>
            </div>
          </div>
        </motion.div>

        {/* Event Creation Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-ocean-50 to-ocean-100 border border-ocean-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-ocean-900 mb-4">Event Guidelines</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-ocean-700">
            <div>
              <h4 className="font-medium mb-2">Safety Requirements</h4>
              <ul className="space-y-1">
                <li>• All events must have qualified safety divers</li>
                <li>• Emergency action plans required</li>
                <li>• Medical clearance for participants</li>
                <li>• Insurance coverage verification</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Community Standards</h4>
              <ul className="space-y-1">
                <li>• Events open to all skill levels when appropriate</li>
                <li>• Respectful and inclusive environment</li>
                <li>• Clear communication of requirements</li>
                <li>• Fair pricing and accessibility</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Events;