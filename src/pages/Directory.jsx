import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiMapPin, FiFilter, FiUser, FiAward, FiStar, FiCalendar, FiMail, FiPhone } = FiIcons;

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  
  // Mock data for instructors
  const instructors = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      role: 'AIDA Master Instructor',
      location: 'Cyprus',
      specialties: ['Deep Diving', 'Safety', 'Coaching'],
      certifications: ['AIDA Master Instructor', 'SSI Level 3 Instructor', 'EFR Instructor'],
      experience: '12 years',
      rating: 4.9,
      reviewCount: 48,
      bio: 'Sarah is a passionate freediving instructor with over a decade of experience teaching students of all levels. Her approach focuses on safety, mental preparation, and proper technique. She specializes in helping students overcome equalization issues and mental blocks.',
      languages: ['English', 'Greek', 'French'],
      availability: 'Weekdays and weekends',
      contactEmail: 'sarah@freedivehub.com',
      contactPhone: '+357 99 123456'
    },
    {
      id: 2,
      name: 'David Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      role: 'Molchanovs Instructor',
      location: 'Thailand',
      specialties: ['Pool Training', 'Static Apnea', 'Breath-hold'],
      certifications: ['Molchanovs Instructor', 'AIDA 4', 'PADI Freediver Instructor'],
      experience: '8 years',
      rating: 4.8,
      reviewCount: 36,
      bio: 'David specializes in pool training and breath-hold techniques. His teaching style emphasizes relaxation, proper body positioning, and efficient breathing. He has coached several national record holders in static apnea.',
      languages: ['English', 'Korean', 'Thai'],
      availability: 'Weekdays',
      contactEmail: 'david@freedivehub.com',
      contactPhone: '+66 81 234567'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      role: 'SSI Freediving Instructor',
      location: 'Mexico',
      specialties: ['Beginner Training', 'Underwater Photography', 'Marine Biology'],
      certifications: ['SSI Level 2 Instructor', 'PADI Freediver Instructor', 'Marine Conservation Specialist'],
      experience: '6 years',
      rating: 4.7,
      reviewCount: 29,
      bio: 'Emma combines her passion for freediving with marine conservation and underwater photography. Her courses are perfect for beginners and those interested in marine life. She offers specialized workshops on underwater photography techniques.',
      languages: ['English', 'Spanish'],
      availability: 'Weekends',
      contactEmail: 'emma@freedivehub.com',
      contactPhone: '+52 998 765432'
    },
    {
      id: 4,
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      role: 'Competition Coach',
      location: 'Philippines',
      specialties: ['Competition Training', 'Depth Disciplines', 'Mental Coaching'],
      certifications: ['AIDA Instructor', 'Former National Record Holder', 'Sports Psychology Cert.'],
      experience: '10 years',
      rating: 4.9,
      reviewCount: 42,
      bio: 'As a former competitive freediver, Mike specializes in training athletes for competitions. His coaching combines technical skill development with mental preparation and competition strategy. He has coached multiple national and international champions.',
      languages: ['English', 'Mandarin', 'Filipino'],
      availability: 'By appointment only',
      contactEmail: 'mike@freedivehub.com',
      contactPhone: '+63 917 123456'
    }
  ];

  const filteredInstructors = instructors.filter(instructor => 
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructor Directory</h1>
          <p className="text-gray-600">
            Find certified instructors and coaches for your freediving journey
          </p>
        </motion.div>

        {/* Search & Filter */}
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
                placeholder="Search by name, location, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <SafeIcon icon={FiMapPin} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent appearance-none"
              >
                <option value="">All Locations</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Thailand">Thailand</option>
                <option value="Mexico">Mexico</option>
                <option value="Philippines">Philippines</option>
              </select>
            </div>
            
            <div className="relative">
              <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent appearance-none"
              >
                <option value="">All Certifications</option>
                <option value="AIDA">AIDA</option>
                <option value="SSI">SSI</option>
                <option value="Molchanovs">Molchanovs</option>
                <option value="PADI">PADI</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Directory Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {filteredInstructors.map((instructor) => (
            <motion.div
              key={instructor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: instructor.id * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover-lift"
              onClick={() => setSelectedInstructor(instructor)}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{instructor.name}</h3>
                    <p className="text-ocean-600">{instructor.role}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <SafeIcon icon={FiMapPin} className="text-gray-400" />
                    <span>{instructor.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <SafeIcon 
                          key={i} 
                          icon={FiStar} 
                          className={i < Math.floor(instructor.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">
                      {instructor.rating} ({instructor.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map(specialty => (
                      <span key={specialty} className="bg-ocean-50 text-ocean-800 px-2 py-1 rounded text-xs font-medium">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="w-full bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instructor Detail Modal */}
        {selectedInstructor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedInstructor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="relative p-8">
                <button 
                  className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                  onClick={() => setSelectedInstructor(null)}
                >
                  <SafeIcon icon={FiIcons.FiX} className="text-gray-600" />
                </button>
                
                <div className="flex flex-col md:flex-row md:space-x-8">
                  <div className="md:w-1/3 mb-6 md:mb-0">
                    <img 
                      src={selectedInstructor.avatar}
                      alt={selectedInstructor.name}
                      className="w-full rounded-xl object-cover"
                    />
                    
                    <div className="mt-6 space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Contact</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiMail} className="text-gray-400" />
                            <span className="text-gray-700">{selectedInstructor.contactEmail}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiPhone} className="text-gray-400" />
                            <span className="text-gray-700">{selectedInstructor.contactPhone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedInstructor.languages.map(language => (
                            <span key={language} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Availability</h3>
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiCalendar} className="text-gray-400" />
                          <span className="text-gray-700">{selectedInstructor.availability}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">{selectedInstructor.name}</h2>
                        <p className="text-xl text-ocean-600">{selectedInstructor.role}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <SafeIcon 
                              key={i} 
                              icon={FiStar} 
                              className={i < Math.floor(selectedInstructor.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                            />
                          ))}
                        </div>
                        <span className="text-gray-600">
                          {selectedInstructor.rating} ({selectedInstructor.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600 mb-6">
                      <SafeIcon icon={FiMapPin} className="text-gray-400" />
                      <span>{selectedInstructor.location}</span>
                      <span className="mx-2">•</span>
                      <SafeIcon icon={FiUser} className="text-gray-400" />
                      <span>{selectedInstructor.experience} experience</span>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                      <p className="text-gray-700">{selectedInstructor.bio}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h3>
                      <div className="space-y-2">
                        {selectedInstructor.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <SafeIcon icon={FiAward} className="text-ocean-500" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedInstructor.specialties.map(specialty => (
                          <span key={specialty} className="bg-ocean-50 text-ocean-800 px-3 py-1 rounded-lg text-sm font-medium">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors">
                        Book a Session
                      </button>
                      <button className="flex-1 border border-ocean-600 text-ocean-600 py-3 rounded-lg font-medium hover:bg-ocean-50 transition-colors">
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Find Instructors Near You</h2>
          
          <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <SafeIcon icon={FiMapPin} className="text-4xl text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Interactive map would render here</p>
              <p className="text-gray-400 text-sm">Showing instructor locations worldwide</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Directory;