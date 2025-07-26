import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useRole } from '../contexts/RoleContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiHeart, FiUser, FiTarget, FiCompass, FiBook, FiStar, FiCalendar, FiClock, FiActivity,
  FiUsers, FiEdit3, FiPlus, FiDownload, FiUpload, FiSettings, FiPlay, 
  FiPause, FiRefreshCw, FiCheckCircle, FiAlertCircle, FiInfo, FiSave
} = FiIcons;

const HumanDesign = () => {
  const { user } = useAuth();
  const { isInstructor } = useRole();
  const [activeTab, setActiveTab] = useState(isInstructor ? 'students' : 'overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showTrainingPlan, setShowTrainingPlan] = useState(false);
  const [showSessionPlanner, setShowSessionPlanner] = useState(false);
  
  // For personal profile
  const [personalProfile, setPersonalProfile] = useState({
    type: 'Generator',
    strategy: 'To Respond',
    authority: 'Sacral',
    profile: '6/2 Role Model Hermit'
  });
  
  // For editing personal profile
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // Here you would typically save to backend
    setIsEditing(false);
  };

  // Mock student data for instructors
  const students = [
    {
      id: 1,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
      type: 'Generator',
      authority: 'Sacral',
      profile: '6/2 Role Model Hermit',
      level: 'Beginner',
      joinDate: '2024-03-15',
      lastSession: '2024-05-18',
      progress: 75,
      currentGoals: ['Reach 15m depth', 'Improve equalization'],
      strengths: ['Consistent practice', 'Good body awareness'],
      challenges: ['Overthinking technique', 'Impatience with progress'],
      preferredStyle: 'Hands-on learning with immediate feedback'
    },
    {
      id: 2,
      name: 'David Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
      type: 'Projector',
      authority: 'Emotional',
      profile: '1/3 Investigator Martyr',
      level: 'Intermediate',
      joinDate: '2024-02-01',
      lastSession: '2024-05-19',
      progress: 60,
      currentGoals: ['Master Frenzel technique', 'Increase static time'],
      strengths: ['Analytical approach', 'Safety conscious'],
      challenges: ['Needs recognition', 'Energy management'],
      preferredStyle: 'Detailed explanations with observation time'
    },
    {
      id: 3,
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      type: 'Manifestor',
      authority: 'Splenic',
      profile: '8/1 Inspiring Investigator',
      level: 'Advanced',
      joinDate: '2024-01-10',
      lastSession: '2024-05-20',
      progress: 85,
      currentGoals: ['Competition preparation', 'Perfect form'],
      strengths: ['Independent learner', 'Quick adaptation'],
      challenges: ['Impatience with group pace', 'Resistance to micro-management'],
      preferredStyle: 'Autonomous practice with minimal guidance'
    },
    {
      id: 4,
      name: 'Jordan Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      type: 'Reflector',
      authority: 'Lunar',
      profile: '4/6 Opportunist Role Model',
      level: 'Beginner',
      joinDate: '2024-04-01',
      lastSession: '2024-05-17',
      progress: 40,
      currentGoals: ['Build confidence', 'Develop routine'],
      strengths: ['Group harmony', 'Adaptable'],
      challenges: ['Needs stable environment', 'Inconsistent energy'],
      preferredStyle: 'Group settings with flexible timelines'
    }
  ];

  // Type descriptions for overview
  const typeDescriptions = {
    'Manifestor': 'Excel at initiating new techniques and leading training sessions, but require adequate rest periods between intense diving sessions',
    'Generator': 'Thrive on consistent training when engaged in activities they love, with natural stamina for extended practice sessions',
    'Manifesting Generator': 'Multi-talented divers who can excel in various freediving disciplines simultaneously, benefiting from flexible training approaches',
    'Projector': 'Natural guides who excel at analyzing technique and providing insights, requiring invitation-based coaching approaches',
    'Reflector': 'Highly sensitive to their diving environment, needing supportive, harmonious training conditions to flourish'
  };

  // Authority descriptions for overview
  const authorityDescriptions = {
    'Emotional': 'Need time to ride their emotional wave before committing to challenging dives or new depth goals',
    'Sacral': 'Make best decisions through gut response to diving opportunities and training intensity',
    'Splenic': 'Benefit from instant, intuitive decision-making about safety and dive conditions',
    'Self-Projected': 'Need to speak out loud about dive plans to hear what feels right',
    'Ego': 'Make best decisions when considering willpower and capabilities',
    'Lunar': 'Need a full lunar cycle (28 days) to make major diving decisions'
  };

  // Training recommendations based on Human Design type
  const getTrainingRecommendations = (type, authority) => {
    const recommendations = {
      Generator: {
        Sacral: {
          approach: 'Respond to gut feelings about techniques',
          pacing: 'Sustainable practice with consistent effort',
          techniques: ['Repetitive drills', 'Incremental depth increases', 'Body awareness exercises'],
          coaching: 'Ask yes/no questions, let them respond to challenges',
          sessions: 'Regular, structured sessions with variety'
        },
        Emotional: {
          approach: 'Wait for emotional clarity before major decisions',
          pacing: 'Respect emotional waves, no pressure during low periods',
          techniques: ['Emotional breathing exercises', 'Mindfulness training', 'Patience building'],
          coaching: 'Check emotional state, provide emotional support',
          sessions: 'Flexible scheduling based on emotional readiness'
        }
      },
      Projector: {
        Emotional: {
          approach: 'Invite sharing, recognize their insights',
          pacing: 'Shorter, focused sessions with rest periods',
          techniques: ['Observation-based learning', 'Technique analysis', 'Efficiency focus'],
          coaching: 'Invite their perspective, recognize their wisdom',
          sessions: 'Quality over quantity, personalized attention'
        },
        Splenic: {
          approach: 'Trust their intuitive timing and insights',
          pacing: 'Spontaneous, intuition-led progression',
          techniques: ['Intuitive breathing', 'Body awareness', 'Safety instincts'],
          coaching: 'Listen to their insights, trust their timing',
          sessions: 'Flexible, intuition-based scheduling'
        }
      },
      Manifestor: {
        Splenic: {
          approach: 'Give autonomy, minimal micromanagement',
          pacing: 'Intense bursts followed by rest',
          techniques: ['Independent practice', 'Goal-oriented training', 'Quick adaptation'],
          coaching: 'Inform of changes, respect their independence',
          sessions: 'Self-directed with periodic check-ins'
        },
        Emotional: {
          approach: 'Respect their emotional process and timing',
          pacing: 'Allow for emotional processing time',
          techniques: ['Emotional regulation', 'Patience training', 'Impulse control'],
          coaching: 'Support emotional clarity, avoid rushing',
          sessions: 'Emotionally-aware scheduling'
        }
      },
      Reflector: {
        Lunar: {
          approach: 'Create stable, harmonious environment',
          pacing: 'Lunar cycle awareness, flexible timelines',
          techniques: ['Environmental awareness', 'Group harmony', 'Sampling different approaches'],
          coaching: 'Provide stable environment, group support',
          sessions: 'Environment-focused, community-based'
        }
      },
      'Manifesting Generator': {
        Sacral: {
          approach: 'Respond to gut feelings but allow multitasking',
          pacing: 'Dynamic, varied sessions with multiple focuses',
          techniques: ['Multi-disciplinary training', 'Varied skill development', 'Quick transitions'],
          coaching: 'Provide variety and challenge, allow task-switching',
          sessions: 'Diverse training formats with multiple elements'
        },
        Emotional: {
          approach: 'Wait for emotional clarity while exploring options',
          pacing: 'Varied activities with emotional awareness',
          techniques: ['Cross-disciplinary exercises', 'Emotional awareness', 'Adaptive training'],
          coaching: 'Support emotional clarity while providing variety',
          sessions: 'Emotionally-aware scheduling with diverse activities'
        }
      }
    };

    return recommendations[type]?.[authority] || {
      approach: 'Personalized approach needed',
      pacing: 'Individual assessment required',
      techniques: ['Standard techniques'],
      coaching: 'Adapt to individual needs',
      sessions: 'Regular sessions'
    };
  };

  const generateTrainingPlan = (student) => {
    const recs = getTrainingRecommendations(student.type, student.authority);
    
    return {
      student: student.name,
      type: student.type,
      authority: student.authority,
      level: student.level,
      duration: '4 weeks',
      sessions: [
        {
          week: 1,
          focus: 'Foundation Building',
          techniques: recs.techniques.slice(0, 2),
          approach: recs.approach,
          duration: student.type === 'Projector' ? '45 min' : '60 min',
          notes: `Focus on ${recs.pacing}`
        },
        {
          week: 2,
          focus: 'Skill Development',
          techniques: recs.techniques,
          approach: recs.approach,
          duration: student.type === 'Projector' ? '45 min' : '60 min',
          notes: `Coaching style: ${recs.coaching}`
        },
        {
          week: 3,
          focus: 'Integration',
          techniques: [...recs.techniques, 'Advanced breathing'],
          approach: recs.approach,
          duration: student.type === 'Projector' ? '45 min' : '60 min',
          notes: `Session style: ${recs.sessions}`
        },
        {
          week: 4,
          focus: 'Mastery & Assessment',
          techniques: ['Assessment', 'Goal setting', 'Future planning'],
          approach: recs.approach,
          duration: student.type === 'Projector' ? '45 min' : '60 min',
          notes: 'Evaluate progress and set new goals'
        }
      ]
    };
  };

  const renderInstructorDashboard = () => (
    <div className="space-y-8">
      {/* Students Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {students.map(student => (
          <motion.div 
            key={student.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover-lift"
            onClick={() => setSelectedStudent(student)}
          >
            <div className="flex items-center space-x-3 mb-4">
              <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.level}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-ocean-600">{student.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Authority:</span>
                <span className="font-medium text-coral-600">{student.authority}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress:</span>
                <span className="font-medium text-green-600">{student.progress}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-ocean-600 h-2 rounded-full transition-all duration-500" 
                style={{width: `${student.progress}%`}}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowTrainingPlan(true)}
              className="w-full flex items-center space-x-3 p-3 bg-ocean-50 rounded-lg hover:bg-ocean-100 transition-colors"
            >
              <SafeIcon icon={FiTarget} className="text-ocean-600" />
              <span className="font-medium text-ocean-700">Generate Training Plan</span>
            </button>
            <button
              onClick={() => setShowSessionPlanner(true)}
              className="w-full flex items-center space-x-3 p-3 bg-coral-50 rounded-lg hover:bg-coral-100 transition-colors"
            >
              <SafeIcon icon={FiCalendar} className="text-coral-600" />
              <span className="font-medium text-coral-700">Plan Session</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <SafeIcon icon={FiUpload} className="text-green-600" />
              <span className="font-medium text-green-700">Upload HD Chart</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Type Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Generators</span>
              <span className="font-medium text-ocean-600">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Projectors</span>
              <span className="font-medium text-coral-600">1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Manifestors</span>
              <span className="font-medium text-green-600">1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reflectors</span>
              <span className="font-medium text-purple-600">1</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <SafeIcon icon={FiCheckCircle} className="text-green-500" />
              <span className="text-gray-700">Emma completed depth goal</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <SafeIcon icon={FiActivity} className="text-ocean-500" />
              <span className="text-gray-700">David's session scheduled</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <SafeIcon icon={FiStar} className="text-yellow-500" />
              <span className="text-gray-700">Alex reached new PB</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderStudentDetail = () => {
    if (!selectedStudent) return null;

    const recommendations = getTrainingRecommendations(selectedStudent.type, selectedStudent.authority);

    return (
      <div className="space-y-6">
        {/* Student Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-20 h-20 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                <p className="text-gray-600">{selectedStudent.level} • {selectedStudent.type} {selectedStudent.authority}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Joined: {selectedStudent.joinDate}</span>
                  <span>Last session: {selectedStudent.lastSession}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setSelectedStudent(null)} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiIcons.FiX} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Training Recommendations */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coaching Approach</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Primary Approach</h4>
                <p className="text-gray-600 text-sm">{recommendations.approach}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Pacing Strategy</h4>
                <p className="text-gray-600 text-sm">{recommendations.pacing}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Coaching Style</h4>
                <p className="text-gray-600 text-sm">{recommendations.coaching}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Techniques</h3>
            <div className="space-y-2">
              {recommendations.techniques.map((technique, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheckCircle} className="text-green-500" />
                  <span className="text-gray-700">{technique}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Session Structure</h4>
              <p className="text-gray-600 text-sm">{recommendations.sessions}</p>
            </div>
          </div>
        </div>

        {/* Student Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Current Goals</h4>
              <ul className="space-y-1">
                {selectedStudent.currentGoals.map((goal, index) => (
                  <li key={index} className="text-sm text-gray-600">• {goal}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Strengths</h4>
              <ul className="space-y-1">
                {selectedStudent.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-green-600">• {strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Areas for Growth</h4>
              <ul className="space-y-1">
                {selectedStudent.challenges.map((challenge, index) => (
                  <li key={index} className="text-sm text-yellow-600">• {challenge}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowTrainingPlan(true)} 
            className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiTarget} />
            <span>Generate Training Plan</span>
          </button>
          <button 
            onClick={() => setShowSessionPlanner(true)} 
            className="flex-1 bg-coral-600 text-white py-3 rounded-lg font-medium hover:bg-coral-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiCalendar} />
            <span>Plan Next Session</span>
          </button>
        </div>
      </div>
    );
  };

  const renderTrainingPlanModal = () => {
    if (!showTrainingPlan || !selectedStudent) return null;

    const plan = generateTrainingPlan(selectedStudent);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Training Plan: {plan.student}</h2>
            <button 
              onClick={() => setShowTrainingPlan(false)} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiIcons.FiX} className="text-gray-400" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            {/* Plan Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <p className="text-ocean-600">{plan.type}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Authority:</span>
                  <p className="text-coral-600">{plan.authority}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Level:</span>
                  <p className="text-green-600">{plan.level}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>
                  <p className="text-purple-600">{plan.duration}</p>
                </div>
              </div>
            </div>

            {/* Weekly Sessions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Sessions</h3>
              {plan.sessions.map((session, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Week {session.week}: {session.focus}</h4>
                      <p className="text-sm text-gray-600">Duration: {session.duration}</p>
                    </div>
                    <span className="bg-ocean-100 text-ocean-800 px-3 py-1 rounded-full text-sm">
                      Week {session.week}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Techniques</h5>
                      <ul className="space-y-1">
                        {session.techniques.map((technique, techIndex) => (
                          <li key={techIndex} className="text-sm text-gray-600 flex items-center space-x-2">
                            <SafeIcon icon={FiCheckCircle} className="text-green-500 text-xs" />
                            <span>{technique}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Notes</h5>
                      <p className="text-sm text-gray-600">{session.notes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center justify-center space-x-2">
                <SafeIcon icon={FiDownload} />
                <span>Download Plan</span>
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Customize Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSessionPlanner = () => {
    if (!showSessionPlanner || !selectedStudent) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Session Planner: {selectedStudent.name}</h2>
            <button 
              onClick={() => setShowSessionPlanner(false)} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiIcons.FiX} className="text-gray-400" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            {/* Session Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500">
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Focus Area</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500">
                    <option>Breathing Techniques</option>
                    <option>Equalization</option>
                    <option>Depth Training</option>
                    <option>Static Apnea</option>
                    <option>Safety & Rescue</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Session Structure */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Session Structure</h3>
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">Warm-up (10 min)</h4>
                    <SafeIcon icon={FiPlay} className="text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600">Relaxation breathing, body awareness</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">Main Practice (25 min)</h4>
                    <SafeIcon icon={FiActivity} className="text-ocean-500" />
                  </div>
                  <p className="text-sm text-gray-600">Core technique practice with {selectedStudent.type}-specific approach</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">Cool-down (10 min)</h4>
                    <SafeIcon icon={FiPause} className="text-coral-500" />
                  </div>
                  <p className="text-sm text-gray-600">Recovery breathing, reflection</p>
                </div>
              </div>
            </div>

            {/* Human Design Considerations */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Human Design Considerations</h3>
              <div className="space-y-2 text-sm">
                <p className="text-purple-700">
                  <strong>Type:</strong> {selectedStudent.type} - {getTrainingRecommendations(selectedStudent.type, selectedStudent.authority).approach}
                </p>
                <p className="text-purple-700">
                  <strong>Authority:</strong> {selectedStudent.authority} - {getTrainingRecommendations(selectedStudent.type, selectedStudent.authority).pacing}
                </p>
                <p className="text-purple-700">
                  <strong>Coaching Style:</strong> {getTrainingRecommendations(selectedStudent.type, selectedStudent.authority).coaching}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors">
                Schedule Session
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Save as Template
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPersonalOverview = () => (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Your Human Design Profile</h3>
          <button 
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)} 
            className="flex items-center space-x-2 bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors"
          >
            <SafeIcon icon={isEditing ? FiSave : FiEdit3} />
            <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              {isEditing ? (
                <select 
                  name="type" 
                  value={personalProfile.type} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                >
                  <option value="Generator">Generator</option>
                  <option value="Manifestor">Manifestor</option>
                  <option value="Projector">Projector</option>
                  <option value="Reflector">Reflector</option>
                  <option value="Manifesting Generator">Manifesting Generator</option>
                </select>
              ) : (
                <p className="text-lg font-semibold text-ocean-600">{personalProfile.type}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Strategy</label>
              {isEditing ? (
                <select 
                  name="strategy" 
                  value={personalProfile.strategy} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                >
                  <option value="To Respond">To Respond</option>
                  <option value="To Inform">To Inform</option>
                  <option value="To Wait for the Invitation">To Wait for the Invitation</option>
                  <option value="To Wait a Lunar Cycle">To Wait a Lunar Cycle</option>
                </select>
              ) : (
                <p className="text-lg font-semibold text-coral-600">{personalProfile.strategy}</p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Authority</label>
              {isEditing ? (
                <select 
                  name="authority" 
                  value={personalProfile.authority} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                >
                  <option value="Emotional">Emotional</option>
                  <option value="Sacral">Sacral</option>
                  <option value="Splenic">Splenic</option>
                  <option value="Self-Projected">Self-Projected</option>
                  <option value="Ego">Ego</option>
                  <option value="Lunar">Lunar</option>
                </select>
              ) : (
                <p className="text-lg font-semibold text-green-600">{personalProfile.authority}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile</label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="profile" 
                  value={personalProfile.profile} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                />
              ) : (
                <p className="text-lg font-semibold text-purple-600">{personalProfile.profile}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Type Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Type Overview</h3>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">
            {typeDescriptions[personalProfile.type] || "Your type description will appear here once you've selected a type."}
          </p>
        </div>
      </div>

      {/* Authority Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Authority Overview</h3>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">
            <strong>Each diver's Authority determines their optimal decision-making process:</strong>
          </p>
          <p className="mb-4">
            {authorityDescriptions[personalProfile.authority] || "Your authority description will appear here once you've selected an authority."}
          </p>
        </div>
      </div>
    </div>
  );

  const renderPersonalRecommendations = () => (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-gray-900">Freediving Recommendations</h3>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-lg font-semibold text-ocean-900 mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiActivity} className="text-ocean-600" />
          <span>Training Style Recommendations</span>
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Based on Your Type: {personalProfile.type}</h5>
            <p className="text-gray-700 mb-4">
              {typeDescriptions[personalProfile.type] || "Select a type to see recommendations"}
            </p>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Based on Your Authority: {personalProfile.authority}</h5>
            <p className="text-gray-700 mb-4">
              {authorityDescriptions[personalProfile.authority] || "Select an authority to see recommendations"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-lg font-semibold text-ocean-900 mb-4">Recommended Freediving Approaches</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Learning Style</h5>
              <ul className="space-y-2">
                {personalProfile.type === "Generator" && (
                  <>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Learn through hands-on experience rather than theory alone</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Practice consistently when you feel energized by the activity</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Build sustainable routines that feel natural to you</span>
                    </li>
                  </>
                )}
                {personalProfile.type === "Manifestor" && (
                  <>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Take initiative in your training when inspired</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Allow for adequate rest between intense sessions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Inform others about your training plans</span>
                    </li>
                  </>
                )}
                {personalProfile.type === "Projector" && (
                  <>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Focus on efficiency and technique over endurance</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Wait for recognition and invitation from instructors</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Take breaks when energy feels low</span>
                    </li>
                  </>
                )}
                {personalProfile.type === "Reflector" && (
                  <>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Choose supportive, harmonious training environments</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Take a full lunar cycle before making major training decisions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Be mindful of your sensitivity to the environment</span>
                    </li>
                  </>
                )}
                {personalProfile.type === "Manifesting Generator" && (
                  <>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Explore multiple disciplines simultaneously</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Benefit from varied, flexible training approaches</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Follow your energy and switch tasks when needed</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Decision-Making</h5>
              <ul className="space-y-2">
                {personalProfile.authority === "Emotional" && (
                  <>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Wait for emotional clarity before committing to challenging dives</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Track your emotional state throughout the training cycle</span>
                    </li>
                  </>
                )}
                {personalProfile.authority === "Sacral" && (
                  <>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Trust your gut response to diving opportunities</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Pay attention to your body's signals about training intensity</span>
                    </li>
                  </>
                )}
                {personalProfile.authority === "Splenic" && (
                  <>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Trust your in-the-moment intuition about dive safety</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Make decisions in the present moment, not from past experiences</span>
                    </li>
                  </>
                )}
                {personalProfile.authority === "Self-Projected" && (
                  <>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Talk through your dive plans out loud to hear what feels right</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Listen to your own voice when making decisions</span>
                    </li>
                  </>
                )}
                {personalProfile.authority === "Ego" && (
                  <>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Consider your willpower and capabilities when setting goals</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Make promises you know you can keep to yourself</span>
                    </li>
                  </>
                )}
                {personalProfile.authority === "Lunar" && (
                  <>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Take a full lunar cycle to make major freediving decisions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">Sample different perspectives before deciding</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (isInstructor) {
      switch (activeTab) {
        case 'students':
          return selectedStudent ? renderStudentDetail() : renderInstructorDashboard();
        case 'guidance':
          return (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Guidance Engine</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Generator Students</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Use hands-on drills and repetitive practice</li>
                    <li>• Set incremental, achievable goals</li>
                    <li>• Ask yes/no questions to guide decisions</li>
                    <li>• Allow them to respond to challenges naturally</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Projector Students</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Provide 1-on-1 feedback and recognition</li>
                    <li>• Give observation time before practice</li>
                    <li>• Invite them to share their insights</li>
                    <li>• Focus on efficiency over repetition</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Manifestor Students</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Give autonomy and independence</li>
                    <li>• Use short bursts of intense activity</li>
                    <li>• Minimize micromanagement</li>
                    <li>• Inform them of changes in advance</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Reflector Students</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Maintain group harmony and stable environment</li>
                    <li>• Use flexible timelines and patient approach</li>
                    <li>• Be aware of environmental sensitivity</li>
                    <li>• Allow time for sampling different approaches</li>
                  </ul>
                </div>
              </div>
            </div>
          );
        default:
          return renderInstructorDashboard();
      }
    } else {
      switch (activeTab) {
        case 'overview':
          return renderPersonalOverview();
        case 'recommendations':
          return renderPersonalRecommendations();
        default:
          return renderPersonalOverview();
      }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isInstructor ? 'Human Design Coaching Platform' : 'Your Human Design Blueprint'}
          </h1>
          <p className="text-gray-600">
            {isInstructor 
              ? 'Personalize your coaching approach using Human Design principles' 
              : 'Discover your unique energetic design and personalized freediving approach'}
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
              {isInstructor ? (
                <>
                  <button
                    onClick={() => setActiveTab('students')}
                    className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === 'students' 
                        ? 'border-b-2 border-ocean-600 text-ocean-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <SafeIcon icon={FiUsers} />
                    <span>Students</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('guidance')}
                    className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === 'guidance' 
                        ? 'border-b-2 border-ocean-600 text-ocean-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <SafeIcon icon={FiTarget} />
                    <span>Guidance Engine</span>
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
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

        {/* Modals */}
        {renderTrainingPlanModal()}
        {renderSessionPlanner()}

        {/* Integration Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-purple-900 mb-4">
            {isInstructor ? 'Instructor Integration' : 'Privacy & Control'}
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-purple-700">
            {isInstructor ? (
              <>
                <div>
                  <h4 className="font-medium mb-2">Platform Features</h4>
                  <ul className="space-y-1">
                    <li>• Automatic training plan generation</li>
                    <li>• Session planning with HD considerations</li>
                    <li>• Student progress tracking</li>
                    <li>• Personalized coaching recommendations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Best Practices</h4>
                  <ul className="space-y-1">
                    <li>• Respect each student's unique design</li>
                    <li>• Adapt coaching style to their type</li>
                    <li>• Honor their natural learning rhythm</li>
                    <li>• Create safe, supportive environment</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h4 className="font-medium mb-2">For Your Instructors</h4>
                  <ul className="space-y-1">
                    <li>• Tailor coaching approach to your energy type</li>
                    <li>• Understand your decision-making process</li>
                    <li>• Recognize your natural learning patterns</li>
                    <li>• Support your authentic development path</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Your Control</h4>
                  <ul className="space-y-1">
                    <li>• Choose which instructors can access your design</li>
                    <li>• Update your type and authority information</li>
                    <li>• Hide specific aspects from instructor view</li>
                    <li>• Request personalized coaching sessions</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HumanDesign;