import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OnBoarding } from '@questlabs/react-sdk';
import { useQuestAuth } from '../contexts/QuestAuthContext';
import questConfig from '../config/questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCompass, FiTarget, FiHeart, FiUsers, FiActivity, FiStar } = FiIcons;

const QuestOnboardingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useQuestAuth();
  const [answers, setAnswers] = useState({});

  const getAnswers = () => {
    // Navigation after onboarding completion
    navigate('/dashboard');
  };

  // Redirect if not authenticated
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Welcome Content */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 left-16 w-24 h-24 rounded-full bg-white/30"></div>
          <div className="absolute top-32 right-24 w-32 h-32 rounded-full bg-white/20"></div>
          <div className="absolute bottom-24 left-12 w-28 h-28 rounded-full bg-white/25"></div>
          <div className="absolute bottom-40 right-16 w-20 h-20 rounded-full bg-white/35"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <SafeIcon icon={FiCompass} className="text-2xl text-white" />
              </div>
              <h1 className="text-3xl font-bold">Let's Get Started!</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Welcome to the
              <br />
              <span className="text-green-200">FreediveHub Community</span>
            </h2>
            
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              We're setting up your personalized freediving experience. This quick setup will help us understand your goals and preferences.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mt-1">
                  <SafeIcon icon={FiTarget} className="text-green-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Personal Goals</h3>
                  <p className="text-green-200">Set your freediving objectives and track progress</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mt-1">
                  <SafeIcon icon={FiHeart} className="text-green-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Learning Style</h3>
                  <p className="text-green-200">Discover your unique approach to freediving</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mt-1">
                  <SafeIcon icon={FiUsers} className="text-green-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Community Connections</h3>
                  <p className="text-green-200">Connect with instructors and fellow freedivers</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mt-1">
                  <SafeIcon icon={FiActivity} className="text-green-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Progress Tracking</h3>
                  <p className="text-green-200">Log dives and monitor your development</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section - Onboarding Component */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex items-center justify-center bg-white p-8"
      >
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiCompass} className="text-white text-lg" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Setup</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's Get Started!</h2>
            <p className="text-gray-600">Personalizing your freediving experience</p>
          </div>

          {/* Quest Onboarding Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full flex justify-center"
            style={{ minHeight: '400px' }}
          >
            <OnBoarding
              userId={currentUser.userId}
              token={currentUser.token}
              questId={questConfig.QUEST_ONBOARDING_QUESTID}
              answer={answers}
              setAnswer={setAnswers}
              getAnswers={getAnswers}
              singleChoose="modal1"
              multiChoice="modal2"
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <OnBoarding.Header />
              <OnBoarding.Content />
              <OnBoarding.Footer />
            </OnBoarding>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8"
          >
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Setup Progress</span>
                <span className="text-sm text-gray-500">Step by step</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{ width: '25%' }}></div>
              </div>
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-6 text-center"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <SafeIcon icon={FiStar} className="text-green-600" />
                <span className="font-medium text-green-800">Welcome to the Community!</span>
              </div>
              <p className="text-sm text-green-700">
                You're joining an exclusive group of passionate freedivers. Let's personalize your experience.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuestOnboardingPage;