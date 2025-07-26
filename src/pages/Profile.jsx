import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiShield, FiUpload, FiEdit, FiSave, FiX, FiCertificate, FiHeart, FiUsers } = FiIcons;

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'Los Angeles, CA',
    bio: 'Passionate freediver exploring the depths of the ocean. Always learning and pushing my limits safely.',
    emergencyContact: 'John Rivera',
    emergencyPhone: '+1 (555) 987-6543',
    certifications: ['AIDA 2', 'Molchanovs Wave 1', 'EFR First Aid'],
    specialties: ['Deep Diving', 'Static Apnea', 'Pool Training'],
    experience: 'Intermediate',
    medicalClearance: '2024-12-01',
    humanDesignType: 'Generator',
    profileVisibility: 'community'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
  };

  const personalBests = [
    { discipline: 'FIM (Free Immersion)', value: '-25m', date: '2024-01-20' },
    { discipline: 'CWTB (Constant Weight Bi-Fins)', value: '-22m', date: '2024-01-15' },
    { discipline: 'STA (Static Apnea)', value: '4:30', date: '2024-01-18' },
    { discipline: 'DYN (Dynamic With Fins)', value: '75m', date: '2024-01-10' }
  ];

  const certificationDetails = [
    {
      name: 'AIDA 2',
      organization: 'AIDA International',
      date: '2023-08-15',
      instructor: 'Sarah Johnson',
      status: 'Active'
    },
    {
      name: 'Molchanovs Wave 1',
      organization: 'Molchanovs',
      date: '2023-12-01',
      instructor: 'David Park',
      status: 'Active'
    },
    {
      name: 'EFR First Aid',
      organization: 'Emergency First Response',
      date: '2024-01-05',
      instructor: 'Mike Chen',
      status: 'Active'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face'}
                  alt={user?.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-ocean-600 text-white p-2 rounded-full hover:bg-ocean-700 transition-colors">
                  <SafeIcon icon={FiUpload} className="text-sm" />
                </button>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-gray-600 mb-2">{profileData.location}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={FiCalendar} />
                    <span>Joined {user?.joinDate}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={FiShield} />
                    <span>Verified Member</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={FiHeart} />
                    <span>Human Design: {profileData.humanDesignType}</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center space-x-2 bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors"
            >
              <SafeIcon icon={isEditing ? FiSave : FiEdit} />
              <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Bio Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">About Me</h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-700">{profileData.bio}</p>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiMail} className="inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiPhone} className="inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiMapPin} className="inline mr-2" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.location}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Emergency Contact</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  <SafeIcon icon={FiUsers} className="inline mr-2" />
                  Emergency Contact Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergencyContact"
                    value={profileData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.emergencyContact}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  <SafeIcon icon={FiPhone} className="inline mr-2" />
                  Emergency Contact Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={profileData.emergencyPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.emergencyPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  <SafeIcon icon={FiShield} className="inline mr-2" />
                  Medical Clearance
                </label>
                <p className="text-gray-600">Valid until: {profileData.medicalClearance}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Personal Bests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Bests</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {personalBests.map((pb, index) => (
              <div key={index} className="bg-ocean-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-ocean-900">{pb.discipline}</h3>
                  <span className="text-2xl font-bold text-ocean-600">{pb.value}</span>
                </div>
                <p className="text-sm text-ocean-700">Achieved on {pb.date}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Certifications</h2>
          
          <div className="space-y-4">
            {certificationDetails.map((cert, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <SafeIcon icon={FiCertificate} className="text-2xl text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                      <p className="text-gray-600 text-sm">{cert.organization}</p>
                      <p className="text-gray-500 text-sm">Instructor: {cert.instructor}</p>
                      <p className="text-gray-500 text-sm">Issued: {cert.date}</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {cert.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Visibility
              </label>
              <select
                name="profileVisibility"
                value={profileData.profileVisibility}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent disabled:bg-gray-50"
              >
                <option value="private">Private (Only me)</option>
                <option value="community">Community Members</option>
                <option value="instructors">Instructors Only</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="shareContact"
                  defaultChecked
                  className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                />
                <label htmlFor="shareContact" className="text-gray-700">Share contact details</label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="shareCerts"
                  defaultChecked
                  className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                />
                <label htmlFor="shareCerts" className="text-gray-700">Show certifications</label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="shareProgress"
                  defaultChecked
                  className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                />
                <label htmlFor="shareProgress" className="text-gray-700">Share progress updates</label>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;