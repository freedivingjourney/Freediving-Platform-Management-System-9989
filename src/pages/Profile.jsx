import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import CertificationProfile from '../components/CertificationProfile';
import supabase from '../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiShield,
  FiUpload,
  FiEdit,
  FiSave,
  FiX,
  FiCertificate,
  FiHeart,
  FiUsers,
  FiChevronDown,
  FiChevronUp
} = FiIcons;

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('basic'); // 'basic', 'certifications', 'bests', 'emergency'
  const [isSaving, setIsSaving] = useState(false);
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

  // Fetch profile data from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) return;

      try {
        const { data, error } = await supabase
          .from('users_access_ld5q7f')
          .select('*')
          .eq('email', user.email)
          .single();

        if (error) throw error;

        if (data) {
          setProfileData({
            ...profileData,
            name: data.name || profileData.name,
            email: data.email || profileData.email,
            certifications: data.certifications || profileData.certifications,
            humanDesignType: data.human_design_type || profileData.humanDesignType
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user?.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('users_access_ld5q7f')
        .update({
          name: profileData.name,
          // Add other fields as needed
          last_active: new Date().toISOString().split('T')[0]
        })
        .eq('email', user.email);

      if (error) throw error;
      
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const personalBests = [
    { discipline: 'FIM (Free Immersion)', value: '-25m', date: '2024-01-20' },
    { discipline: 'CWTB (Constant Weight Bi-Fins)', value: '-22m', date: '2024-01-15' },
    { discipline: 'STA (Static Apnea)', value: '4:30', date: '2024-01-18' },
    { discipline: 'DYN (Dynamic With Fins)', value: '75m', date: '2024-01-10' }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-8 mb-8">
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
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={isEditing ? FiSave : FiEdit} />
                  <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                </>
              )}
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

        {/* Profile Sections Navigation */}
        <div className="flex mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveSection('basic')}
            className={`px-6 py-3 font-medium text-sm flex items-center space-x-2 rounded-t-lg ${
              activeSection === 'basic'
                ? 'bg-white text-ocean-600 border-t border-l border-r border-gray-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <SafeIcon icon={FiUser} />
            <span>Basic Info</span>
          </button>
          <button
            onClick={() => setActiveSection('certifications')}
            className={`px-6 py-3 font-medium text-sm flex items-center space-x-2 rounded-t-lg ${
              activeSection === 'certifications'
                ? 'bg-white text-ocean-600 border-t border-l border-r border-gray-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <SafeIcon icon={FiCertificate} />
            <span>Certifications</span>
          </button>
          <button
            onClick={() => setActiveSection('bests')}
            className={`px-6 py-3 font-medium text-sm flex items-center space-x-2 rounded-t-lg ${
              activeSection === 'bests'
                ? 'bg-white text-ocean-600 border-t border-l border-r border-gray-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <SafeIcon icon={FiUsers} />
            <span>Personal Bests</span>
          </button>
          <button
            onClick={() => setActiveSection('emergency')}
            className={`px-6 py-3 font-medium text-sm flex items-center space-x-2 rounded-t-lg ${
              activeSection === 'emergency'
                ? 'bg-white text-ocean-600 border-t border-l border-r border-gray-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <SafeIcon icon={FiShield} />
            <span>Emergency Info</span>
          </button>
        </div>

        {/* Section Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          {activeSection === 'basic' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiMail} className="inline mr-2" /> Email Address
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
                    <SafeIcon icon={FiPhone} className="inline mr-2" /> Phone Number
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
                    <SafeIcon icon={FiMapPin} className="inline mr-2" /> Location
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

              {/* Privacy Settings */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy Settings</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
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
                    <label htmlFor="shareContact" className="text-gray-700">
                      Share contact details
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="shareCerts"
                      defaultChecked
                      className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                    />
                    <label htmlFor="shareCerts" className="text-gray-700">
                      Show certifications
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="shareProgress"
                      defaultChecked
                      className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                    />
                    <label htmlFor="shareProgress" className="text-gray-700">
                      Share progress updates
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'certifications' && (
            <CertificationProfile />
          )}

          {activeSection === 'bests' && (
            <div>
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
              <p className="mt-6 text-sm text-gray-600">
                Personal bests are automatically updated from your logged dives. Visit the Analytics page for detailed progress tracking.
              </p>
            </div>
          )}

          {activeSection === 'emergency' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Emergency Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    <SafeIcon icon={FiUsers} className="inline mr-2" /> Emergency Contact Name
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
                    <SafeIcon icon={FiPhone} className="inline mr-2" /> Emergency Contact Phone
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
                    <SafeIcon icon={FiShield} className="inline mr-2" /> Medical Clearance
                  </label>
                  <p className="text-gray-600">Valid until: {profileData.medicalClearance}</p>
                </div>
              </div>
              <div className="mt-6 bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiShield} className="text-red-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-red-900 mb-1">Emergency Information Privacy</h4>
                    <p className="text-sm text-red-700">
                      This information will only be accessible to instructors during sessions and events for safety purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;