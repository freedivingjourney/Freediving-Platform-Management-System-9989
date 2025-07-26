import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiVideo, FiAward, FiCalendar, FiClock, FiUser, FiCheck, FiLock, FiPlay, FiMapPin } = FiIcons;

const Classes = () => {
  const programs = [
    {
      id: 1,
      title: 'Freediving Fundamentals',
      instructor: 'Sarah Johnson',
      level: 'Beginner',
      duration: '4 weeks',
      modules: 12,
      enrolled: 24,
      progress: 0,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop',
      description: 'Master the foundational skills of freediving including breathing techniques, equalization, and safety protocols.',
      locked: false
    },
    {
      id: 2,
      title: 'Advanced Equalization Techniques',
      instructor: 'David Park',
      level: 'Intermediate',
      duration: '3 weeks',
      modules: 8,
      enrolled: 16,
      progress: 0,
      image: 'https://images.unsplash.com/photo-1551244072-5d11b96f9abb?w=300&h=200&fit=crop',
      description: 'Take your equalization skills to the next level with advanced techniques for deeper dives.',
      locked: false
    },
    {
      id: 3,
      title: 'Static Apnea Mastery',
      instructor: 'Emma Wilson',
      level: 'All Levels',
      duration: '2 weeks',
      modules: 6,
      enrolled: 18,
      progress: 0,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop',
      description: 'Improve your breath-hold times and relaxation techniques through specialized static apnea training.',
      locked: false
    },
    {
      id: 4,
      title: 'Competitive Freediving Preparation',
      instructor: 'Mike Chen',
      level: 'Advanced',
      duration: '6 weeks',
      modules: 15,
      enrolled: 10,
      progress: 0,
      image: 'https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=300&h=200&fit=crop',
      description: 'Comprehensive training program designed for competitive freedivers looking to improve performance.',
      locked: true
    }
  ];
  
  const featuredCourse = {
    title: 'Dynamic Apnea Techniques',
    instructor: 'Sarah Johnson',
    level: 'Intermediate',
    duration: '4 weeks',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop'
  };
  
  const upcomingClasses = [
    {
      title: 'Pool Training Workshop',
      date: 'June 15, 2024',
      time: '10:00 AM - 2:00 PM',
      location: 'City Aquatic Center',
      instructor: 'David Park',
      spots: '3 spots left'
    },
    {
      title: 'Open Water Weekend',
      date: 'June 22-23, 2024',
      time: '8:00 AM - 4:00 PM',
      location: 'Blue Lagoon',
      instructor: 'Sarah Johnson',
      spots: '5 spots left'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Programs</h1>
          <p className="text-gray-600">
            Structured learning paths and educational resources for all freediving levels
          </p>
        </motion.div>

        {/* Featured Course */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 relative"
        >
          <div className="relative rounded-2xl overflow-hidden">
            <img 
              src={featuredCourse.image}
              alt={featuredCourse.title}
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/10"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="bg-ocean-600 text-white px-3 py-1 rounded-full text-sm font-medium inline-block mb-3">
                Featured Program
              </span>
              <h2 className="text-3xl font-bold text-white mb-2">{featuredCourse.title}</h2>
              <div className="flex flex-wrap items-center text-white/90 gap-6 mb-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiUser} />
                  <span>{featuredCourse.instructor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiAward} />
                  <span>{featuredCourse.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCalendar} />
                  <span>{featuredCourse.duration}</span>
                </div>
              </div>
              <button className="bg-white text-ocean-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2">
                <SafeIcon icon={FiPlay} />
                <span>Preview Course</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Course Catalog */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Course Catalog</h2>
            <div className="flex space-x-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white">
                <option>All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white">
                <option>All Categories</option>
                <option>Pool Training</option>
                <option>Open Water</option>
                <option>Techniques</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + program.id * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift"
              >
                <div className="relative">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-48 object-cover"
                  />
                  {program.locked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-3">
                        <SafeIcon icon={FiLock} className="text-2xl text-gray-800" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                    {program.level}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{program.description}</p>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiUser} className="text-xs" />
                      <span>{program.instructor}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiCalendar} className="text-xs" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiBook} className="text-xs" />
                      <span>{program.modules} modules</span>
                    </div>
                  </div>
                  
                  <button className={`w-full py-2 rounded-lg font-medium flex items-center justify-center space-x-2 ${program.locked ? 'bg-gray-100 text-gray-500' : 'bg-ocean-600 text-white hover:bg-ocean-700'} transition-colors`}>
                    <SafeIcon icon={program.locked ? FiLock : FiPlay} />
                    <span>{program.locked ? 'Premium Content' : 'Start Learning'}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Live Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Live Classes</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingClasses.map((liveClass, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover-lift"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{liveClass.title}</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiCalendar} className="text-ocean-500" />
                        <span>{liveClass.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiClock} className="text-ocean-500" />
                        <span>{liveClass.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiMapPin} className="text-ocean-500" />
                        <span>{liveClass.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiUser} className="text-ocean-500" />
                        <span>Instructor: {liveClass.instructor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      {liveClass.spots}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                  <button className="text-ocean-600 font-medium hover:text-ocean-700">
                    View Details
                  </button>
                  <button className="bg-ocean-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-ocean-700 transition-colors">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Learning Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Certification Pathways</h2>
          
          <div className="space-y-8">
            <div className="border-l-4 border-ocean-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Recreational Freediver Path</h3>
              <p className="text-gray-600 mb-4">Perfect for beginners looking to safely enjoy freediving as a recreational activity.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-ocean-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-ocean-800 mb-1">
                    <SafeIcon icon={FiCheck} className="text-ocean-600" />
                    <span className="font-medium">Level 1: Introduction</span>
                  </div>
                  <p className="text-ocean-700 text-sm">Basic techniques, safety, and shallow water dives</p>
                </div>
                <div className="bg-ocean-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-ocean-800 mb-1">
                    <SafeIcon icon={FiCheck} className="text-ocean-600" />
                    <span className="font-medium">Level 2: Foundation</span>
                  </div>
                  <p className="text-ocean-700 text-sm">Advanced techniques, deeper dives, improved safety skills</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-800 mb-1">
                    <SafeIcon icon={FiLock} className="text-gray-400" />
                    <span className="font-medium">Level 3: Mastery</span>
                  </div>
                  <p className="text-gray-500 text-sm">Complete freediving techniques and deeper exploration</p>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-coral-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitive Freediver Path</h3>
              <p className="text-gray-600 mb-4">Designed for those looking to compete and push their personal limits safely.</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-coral-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-coral-800 mb-1">
                    <SafeIcon icon={FiCheck} className="text-coral-600" />
                    <span className="font-medium">Foundation</span>
                  </div>
                  <p className="text-coral-700 text-sm">Competitive basics</p>
                </div>
                <div className="bg-coral-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-coral-800 mb-1">
                    <SafeIcon icon={FiCheck} className="text-coral-600" />
                    <span className="font-medium">Advanced</span>
                  </div>
                  <p className="text-coral-700 text-sm">Performance techniques</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-800 mb-1">
                    <SafeIcon icon={FiLock} className="text-gray-400" />
                    <span className="font-medium">Elite</span>
                  </div>
                  <p className="text-gray-500 text-sm">Competition preparation</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-800 mb-1">
                    <SafeIcon icon={FiLock} className="text-gray-400" />
                    <span className="font-medium">Master</span>
                  </div>
                  <p className="text-gray-500 text-sm">Elite performance coaching</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Classes;