import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiUser, FiMail, FiLock, FiMapPin, FiCalendar, FiPhone, FiFileText } = FiIcons;

const AuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login'); // 'login', 'register', 'pending'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    location: '',
    birthDate: '',
    birthTime: '',
    birthLocation: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalClearance: false,
    freedivingGroup: '',
    certifications: '',
    instructorReferral: '',
    bio: ''
  });
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'login') {
      try {
        await login(formData.email, formData.password);
        setIsOpen(false);
      } catch (error) {
        console.error('Login failed:', error);
      }
    } else if (mode === 'register') {
      try {
        await register(formData);
        setMode('pending');
      } catch (error) {
        console.error('Registration failed:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <>
      {/* Trigger Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setMode('login');
            setIsOpen(true);
          }}
          className="bg-white text-ocean-600 px-6 py-3 rounded-full shadow-lg border border-ocean-200 font-medium hover:bg-ocean-50 transition-colors"
        >
          Sign In
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setMode('register');
            setIsOpen(true);
          }}
          className="bg-ocean-600 text-white px-6 py-3 rounded-full shadow-lg font-medium hover:bg-ocean-700 transition-colors"
        >
          Apply for Membership
        </motion.button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {mode === 'pending' ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={FiUser} className="text-2xl text-ocean-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for applying to join our exclusive freediving community. Your application is under review and you'll receive an email once it's approved.
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                      {mode === 'login' ? 'Welcome Back' : 'Join Our Community'}
                    </h2>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiX} className="text-xl text-gray-400" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {mode === 'register' && (
                      <div className="bg-ocean-50 border border-ocean-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-ocean-700">
                          <strong>Exclusive Access:</strong> This platform is available by invitation only to our students, friends, colleagues, and community members. All applications require manual approval.
                        </p>
                      </div>
                    )}

                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <SafeIcon icon={FiMail} className="inline mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <SafeIcon icon={FiLock} className="inline mr-2" />
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                          required
                        />
                      </div>

                      {mode === 'register' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <SafeIcon icon={FiUser} className="inline mr-2" />
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <SafeIcon icon={FiPhone} className="inline mr-2" />
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <SafeIcon icon={FiMapPin} className="inline mr-2" />
                              Location/Country
                            </label>
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                              required
                            />
                          </div>

                          {/* Human Design Birth Information */}
                          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                            <h3 className="font-medium text-gray-900">Birth Information (for Human Design Chart)</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Birth Date
                                </label>
                                <input
                                  type="date"
                                  name="birthDate"
                                  value={formData.birthDate}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Birth Time
                                </label>
                                <input
                                  type="time"
                                  name="birthTime"
                                  value={formData.birthTime}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Birth Location (City, Country)
                              </label>
                              <input
                                type="text"
                                name="birthLocation"
                                value={formData.birthLocation}
                                onChange={handleInputChange}
                                placeholder="e.g., Los Angeles, USA"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                                required
                              />
                            </div>
                          </div>

                          {/* Emergency Contact */}
                          <div className="bg-red-50 rounded-lg p-4 space-y-4">
                            <h3 className="font-medium text-red-900">Emergency Contact</h3>
                            
                            <div>
                              <label className="block text-sm font-medium text-red-700 mb-2">
                                Emergency Contact Name
                              </label>
                              <input
                                type="text"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-red-700 mb-2">
                                Emergency Contact Phone
                              </label>
                              <input
                                type="tel"
                                name="emergencyPhone"
                                value={formData.emergencyPhone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                              />
                            </div>
                          </div>

                          {/* Freediving Information */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Freediving Group/School (if applicable)
                            </label>
                            <input
                              type="text"
                              name="freedivingGroup"
                              value={formData.freedivingGroup}
                              onChange={handleInputChange}
                              placeholder="e.g., AIDA, Molchanovs, local club"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Certifications (optional)
                            </label>
                            <input
                              type="text"
                              name="certifications"
                              value={formData.certifications}
                              onChange={handleInputChange}
                              placeholder="e.g., AIDA 2, Molchanovs Wave 1"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Instructor Referral (optional)
                            </label>
                            <input
                              type="text"
                              name="instructorReferral"
                              value={formData.instructorReferral}
                              onChange={handleInputChange}
                              placeholder="Name of referring instructor"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <SafeIcon icon={FiFileText} className="inline mr-2" />
                              Brief Bio / Why do you want to join?
                            </label>
                            <textarea
                              name="bio"
                              value={formData.bio}
                              onChange={handleInputChange}
                              rows={3}
                              placeholder="Tell us about your freediving journey and goals..."
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                              required
                            />
                          </div>

                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              name="medicalClearance"
                              checked={formData.medicalClearance}
                              onChange={handleInputChange}
                              className="mt-1 rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                              required
                            />
                            <label className="text-sm text-gray-700">
                              I confirm that I am medically cleared for freediving activities and understand the inherent risks involved. I will follow all safety protocols and guidelines.
                            </label>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        className="flex-1 text-ocean-600 font-medium hover:text-ocean-700 transition-colors"
                      >
                        {mode === 'login' ? 'Need to apply?' : 'Already have access?'}
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
                      >
                        {mode === 'login' ? 'Sign In' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AuthModal;