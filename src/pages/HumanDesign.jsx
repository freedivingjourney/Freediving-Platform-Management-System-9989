import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiUser, FiTarget, FiBook, FiStar, FiCalendar, FiClock, FiActivity } = FiIcons;

const HumanDesign = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Human Design data - would be calculated from birth information
  const humanDesignData = {
    type: 'Generator',
    strategy: 'To Respond',
    authority: 'Sacral',
    profile: '6/2 Role Model Hermit',
    definition: 'Single Definition',
    centers: {
      head: { defined: false, description: 'Mental pressure and inspiration' },
      ajna: { defined: true, description: 'Mental awareness and conceptualization' },
      throat: { defined: true, description: 'Communication and manifestation' },
      g: { defined: true, description: 'Identity and direction' },
      heart: { defined: false, description: 'Willpower and ego' },
      spleen: { defined: true, description: 'Intuition and survival instinct' },
      sacral: { defined: true, description: 'Life force and response' },
      solarPlexus: { defined: false, description: 'Emotions and feelings' },
      root: { defined: false, description: 'Pressure and stress' }
    },
    gates: [1, 13, 25, 46, 2, 14, 29, 59, 27, 50],
    channels: [
      { name: 'Channel of the Beat', gates: [1, 8], description: 'Individual knowing' },
      { name: 'Channel of the Prodigal', gates: [46, 29], description: 'Struggling' }
    ]
  };

  const freedivingRecommendations = {
    trainingStyle: [
      'Follow your gut response when choosing training methods',
      'Listen to your body\'s signals during breath-hold practice',
      'Take time to master techniques before moving to advanced levels',
      'Work in cycles - intense training followed by rest periods'
    ],
    learningApproach: [
      'Learn through hands-on experience rather than theory alone',
      'Practice with others who inspire and energize you',
      'Trust your intuitive sense of what feels right in the water',
      'Build sustainable routines that feel natural to you'
    ],
    coachingStyle: [
      'Respond to coaching suggestions rather than being pushed',
      'Work with instructors who recognize your natural rhythm',
      'Benefit from group training environments',
      'Need clear yes/no questions from coaches'
    ],
    goalSetting: [
      'Set goals based on your genuine excitement and response',
      'Break larger goals into smaller, manageable steps',
      'Allow for flexibility in your training timeline',
      'Focus on mastery rather than rushing to achieve'
    ]
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Human Design Type</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold text-ocean-600">{humanDesignData.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Strategy:</span>
                    <span className="font-semibold text-coral-600">{humanDesignData.strategy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Authority:</span>
                    <span className="font-semibold text-green-600">{humanDesignData.authority}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profile:</span>
                    <span className="font-semibold text-purple-600">{humanDesignData.profile}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bodygraph</h3>
                <div className="human-design-chart bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <SafeIcon icon={FiUser} className="text-6xl text-ocean-300 mx-auto mb-4" />
                    <p className="text-gray-500">Interactive Human Design Chart</p>
                    <p className="text-gray-400 text-sm">Generated from your birth data</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Type Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Generator Type Overview</h3>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  As a Generator, you are designed to respond to life rather than initiate. Your Sacral center provides 
                  you with sustainable life force energy when you're engaged in work that truly lights you up. In 
                  freediving, this means following your gut response to training methods and dive opportunities.
                </p>
                <p className="mb-4">
                  Your strategy is to wait for things to respond to, rather than making things happen through force. 
                  This doesn't mean being passive - it means being aware and ready to respond when the right 
                  opportunities present themselves in your freediving journey.
                </p>
                <p>
                  Your Sacral Authority means you make decisions through your gut response - a literal "uh-huh" (yes) 
                  or "unh-unh" (no) that comes from your core. Trust this response when choosing instructors, 
                  training programs, or dive locations.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'centers':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Energy Centers</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(humanDesignData.centers).map(([centerName, centerData]) => (
                <div key={centerName} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 capitalize">{centerName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      centerData.defined 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {centerData.defined ? 'Defined' : 'Undefined'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{centerData.description}</p>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      {centerData.defined 
                        ? 'Consistent and reliable energy in this area'
                        : 'Variable energy - wisdom through experience'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'recommendations':
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-900">Freediving Recommendations</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-ocean-900 mb-4 flex items-center space-x-2">
                  <SafeIcon icon={FiActivity} className="text-ocean-600" />
                  <span>Training Style</span>
                </h4>
                <ul className="space-y-2">
                  {freedivingRecommendations.trainingStyle.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-ocean-900 mb-4 flex items-center space-x-2">
                  <SafeIcon icon={FiBook} className="text-ocean-600" />
                  <span>Learning Approach</span>
                </h4>
                <ul className="space-y-2">
                  {freedivingRecommendations.learningApproach.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-ocean-900 mb-4 flex items-center space-x-2">
                  <SafeIcon icon={FiUser} className="text-ocean-600" />
                  <span>Coaching Style</span>
                </h4>
                <ul className="space-y-2">
                  {freedivingRecommendations.coachingStyle.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-ocean-900 mb-4 flex items-center space-x-2">
                  <SafeIcon icon={FiStar} className="text-ocean-600" />
                  <span>Goal Setting</span>
                </h4>
                <ul className="space-y-2">
                  {freedivingRecommendations.goalSetting.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Human Design Blueprint</h1>
          <p className="text-gray-600">
            Discover your unique energetic design and personalized freediving approach
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg mb-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'overview' 
                  ? 'border-b-2 border-ocean-600 text-ocean-600' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiHeart} />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('centers')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'centers' 
                  ? 'border-b-2 border-ocean-600 text-ocean-600' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiUser} />
                <span>Energy Centers</span>
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'recommendations' 
                  ? 'border-b-2 border-ocean-600 text-ocean-600' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={FiTarget} />
                <span>Freediving Recommendations</span>
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

        {/* Coaching Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-purple-900 mb-4">Instructor Integration</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-purple-700">
            <div>
              <h4 className="font-medium mb-2">For Your Instructors</h4>
              <p className="mb-2">
                Your Human Design information is available to your instructors to help them:
              </p>
              <ul className="space-y-1">
                <li>• Tailor their coaching approach to your energy type</li>
                <li>• Understand your decision-making process</li>
                <li>• Recognize your natural learning patterns</li>
                <li>• Support your authentic development path</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Privacy & Control</h4>
              <p className="mb-2">
                You have full control over your Human Design information:
              </p>
              <ul className="space-y-1">
                <li>• Choose which instructors can access your design</li>
                <li>• Update your birth information if needed</li>
                <li>• Hide specific aspects from instructor view</li>
                <li>• Request personalized coaching sessions</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HumanDesign;