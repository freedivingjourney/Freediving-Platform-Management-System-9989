import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuestLogin } from '@questlabs/react-sdk';
import { useQuestAuth } from '../contexts/QuestAuthContext';
import questConfig from '../config/questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiActivity, FiHeart, FiShield, FiUsers } = FiIcons;

const QuestLoginPage = () => {
  const navigate = useNavigate();
  const { handleLogin } = useQuestAuth();

  const onLoginSubmit = ({ userId, token, newUser }) => {
    // Store authentication data
    const loginData = handleLogin({ userId, token, newUser });
    
    // Navigate based on user status
    if (newUser) {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ocean-600 via-ocean-500 to-ocean-400 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20"></div>
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-white/15"></div>
          <div className="absolute bottom-32 left-20 w-40 h-40 rounded-full bg-white/10"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-white/25"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <SafeIcon icon={FiActivity} className="text-2xl text-white" />
              </div>
              <h1 className="text-3xl font-bold">FreediveHub</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Welcome Back to Your
              <br />
              <span className="text-ocean-200">Freediving Journey</span>
            </h2>
            
            <p className="text-xl text-ocean-100 mb-8 leading-relaxed">
              Continue tracking your progress, connect with the community, and explore the depths safely with our comprehensive platform.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiHeart} className="text-ocean-200" />
                </div>
                <div>
                  <h3 className="font-semibold">Personalized Learning</h3>
                  <p className="text-sm text-ocean-200">Human Design integration</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiShield} className="text-ocean-200" />
                </div>
                <div>
                  <h3 className="font-semibold">Safety First</h3>
                  <p className="text-sm text-ocean-200">Trusted protocols</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiUsers} className="text-ocean-200" />
                </div>
                <div>
                  <h3 className="font-semibold">Expert Community</h3>
                  <p className="text-sm text-ocean-200">Certified instructors</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiActivity} className="text-ocean-200" />
                </div>
                <div>
                  <h3 className="font-semibold">Complete Tracking</h3>
                  <p className="text-sm text-ocean-200">Comprehensive logging</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section - Login Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex items-center justify-center bg-white p-8"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-ocean-500 to-ocean-600 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiActivity} className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold text-ocean-900">FreediveHub</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue your freediving journey</p>
          </motion.div>

          {/* Quest Login Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-full flex justify-center"
            style={{ minHeight: '400px' }}
          >
            <QuestLogin
              onSubmit={onLoginSubmit}
              email={true}
              google={false}
              accent={questConfig.PRIMARY_COLOR}
              style={{ width: '100%', maxWidth: '400px' }}
            />
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="bg-ocean-50 border border-ocean-200 rounded-lg p-4">
              <p className="text-sm text-ocean-700">
                <strong>New to FreediveHub?</strong> Our platform is invitation-only. 
                Contact your instructor or apply for membership to join our exclusive community.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuestLoginPage;