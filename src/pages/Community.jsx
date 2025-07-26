import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageCircle, FiUsers, FiCalendar, FiHeart, FiSearch, FiFilter, FiPlus, FiThumbsUp, FiMessageSquare, FiShare2, FiBookmark, FiFlag, FiMapPin, FiClock } = FiIcons;

const Community = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for discussions
  const discussions = [
    {
      id: 1,
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        role: 'AIDA Instructor'
      },
      title: 'Tips for improving equalization at depth',
      content: 'I have been working with students who struggle with equalization beyond 15m. Here are some techniques that have proven effective...',
      category: 'Techniques',
      tags: ['Equalization', 'Depth', 'Training'],
      likes: 24,
      comments: 8,
      timestamp: '2 days ago'
    },
    {
      id: 2,
      author: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'Competitive Freediver'
      },
      title: 'Competition preparation mindset',
      content: 'With the upcoming AIDA competition, I wanted to share my mental preparation routine that helps me stay focused and calm...',
      category: 'Competition',
      tags: ['Mental Training', 'Competition', 'Preparation'],
      likes: 31,
      comments: 12,
      timestamp: '4 days ago'
    },
    {
      id: 3,
      author: {
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        role: 'Recreational Freediver'
      },
      title: 'Best dive spots in the Mediterranean',
      content: 'Just returned from a freediving trip around the Mediterranean. Here are my top recommendations for dive sites with crystal clear water and amazing marine life...',
      category: 'Locations',
      tags: ['Travel', 'Mediterranean', 'Dive Sites'],
      likes: 42,
      comments: 15,
      timestamp: '1 week ago',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop'
    }
  ];

  // Mock data for members
  const members = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
      role: 'AIDA Instructor',
      location: 'Cyprus',
      certifications: ['AIDA Master Instructor', 'PADI Freediver Instructor'],
      specialties: ['Deep Diving', 'Safety', 'Coaching']
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      role: 'Competitive Freediver',
      location: 'Japan',
      certifications: ['AIDA Instructor', 'National Champion'],
      specialties: ['CWT', 'FIM', 'Competition']
    },
    {
      id: 3,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
      role: 'Recreational Freediver',
      location: 'Australia',
      certifications: ['AIDA 3', 'SSI Level 2'],
      specialties: ['Photography', 'Marine Life', 'Travel']
    },
    {
      id: 4,
      name: 'David Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
      role: 'Safety Diver',
      location: 'Thailand',
      certifications: ['AIDA 4', 'EFR Instructor'],
      specialties: ['Safety', 'Rescue', 'First Aid']
    }
  ];

  // Mock data for upcoming events
  const events = [
    {
      id: 1,
      title: 'Weekly Pool Training',
      date: 'Every Tuesday',
      time: '7:00 PM - 9:00 PM',
      location: 'City Aquatic Center',
      attendees: 12,
      capacity: 15,
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=150&fit=crop'
    },
    {
      id: 2,
      title: 'Blue Hole Freediving Weekend',
      date: 'June 15-16, 2024',
      time: '8:00 AM - 5:00 PM',
      location: 'Blue Hole, Cyprus',
      attendees: 8,
      capacity: 10,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=150&fit=crop'
    },
    {
      id: 3,
      title: 'Freediving Film Night',
      date: 'June 22, 2024',
      time: '6:30 PM - 9:30 PM',
      location: 'Ocean View Community Center',
      attendees: 24,
      capacity: 40,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=150&fit=crop'
    }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'discussions':
        return (
          <div className="space-y-6">
            {discussions.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: post.id * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <img 
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                    <p className="text-sm text-gray-500">{post.author.role} • {post.timestamp}</p>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4">{post.content}</p>
                
                {post.image && (
                  <img 
                    src={post.image}
                    alt="Post attachment"
                    className="w-full h-60 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-ocean-100 text-ocean-800 px-2 py-1 rounded text-xs font-medium">
                    {post.category}
                  </span>
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between border-t border-gray-200 pt-4">
                  <div className="flex space-x-6">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
                      <SafeIcon icon={FiThumbsUp} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
                      <SafeIcon icon={FiMessageSquare} />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
                      <SafeIcon icon={FiShare2} />
                    </button>
                  </div>
                  <div className="flex space-x-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <SafeIcon icon={FiBookmark} />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <SafeIcon icon={FiFlag} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );
      
      case 'members':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(member => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: member.id * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                    <p className="text-ocean-600">{member.role}</p>
                    <p className="text-sm text-gray-500">{member.location}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Certifications</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.certifications.map(cert => (
                        <span key={cert} className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map(specialty => (
                        <span key={specialty} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                  <button className="flex-1 bg-ocean-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-ocean-700 transition-colors">
                    View Profile
                  </button>
                  <button className="flex-1 border border-ocean-600 text-ocean-600 py-2 rounded-lg text-sm font-medium hover:bg-ocean-50 transition-colors">
                    Message
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        );
      
      case 'events':
        return (
          <div className="space-y-6">
            {events.map(event => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: event.id * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row"
              >
                <div className="md:w-1/3">
                  <img 
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCalendar} className="text-ocean-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiClock} className="text-ocean-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiMapPin} className="text-ocean-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiUsers} className="text-ocean-500" />
                      <span>{event.attendees}/{event.capacity} Participants</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-ocean-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-ocean-700 transition-colors">
                      RSVP
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
            <p className="text-gray-600">
              Connect with fellow freedivers in our exclusive community
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} />
            <span>New Post</span>
          </motion.button>
        </motion.div>

        {/* Tabs & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg mb-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('discussions')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'discussions' 
                  ? 'border-b-2 border-ocean-600 text-ocean-600' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiMessageCircle} />
                <span>Discussions</span>
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'members' 
                  ? 'border-b-2 border-ocean-600 text-ocean-600' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiUsers} />
                <span>Members</span>
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'events' 
                  ? 'border-b-2 border-ocean-600 text-ocean-600' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiCalendar} />
                <span>Events</span>
              </button>
            </div>
          </div>
          
          <div className="p-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-grow">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white">
                <option>All Categories</option>
                <option>Techniques</option>
                <option>Safety</option>
                <option>Equipment</option>
                <option>Locations</option>
                <option>Competition</option>
              </select>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <SafeIcon icon={FiFilter} className="text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>

        {/* Community Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-ocean-50 to-ocean-100 border border-ocean-200 rounded-xl p-6"
        >
          <div className="flex items-start space-x-4">
            <SafeIcon icon={FiHeart} className="text-2xl text-ocean-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-ocean-900 mb-2">Community Guidelines</h3>
              <p className="text-ocean-700">
                Our community is built on respect, safety, and shared passion for freediving. Please keep discussions constructive, respect privacy, and prioritize safety in all advice. Remember that this is an exclusive space for verified members only.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Community;