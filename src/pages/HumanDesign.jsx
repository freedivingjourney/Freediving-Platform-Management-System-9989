import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {useAuth} from '../contexts/AuthContext';
import {useRole, PERMISSIONS} from '../contexts/RoleContext';
import ProtectedRoute from '../components/ProtectedRoute';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiHeart, FiUser, FiTarget, FiCompass, FiBook, FiStar, FiCalendar, FiClock, FiActivity, FiUsers, FiEdit3, FiPlus, FiDownload, FiUpload, FiSettings, FiPlay, FiPause, FiRefreshCw, FiCheckCircle, FiAlertCircle, FiInfo, FiSave, FiX} = FiIcons;

const HumanDesign = () => {
  const {user} = useAuth();
  const {isInstructor, hasPermission} = useRole();

  // For students, always show overview tab. For instructors, default to students tab
  const [activeTab, setActiveTab] = useState(isInstructor() ? 'students' : 'overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showTrainingPlan, setShowTrainingPlan] = useState(false);
  const [showSessionPlanner, setShowSessionPlanner] = useState(false);

  // For personal profile - initialize from user data or defaults
  const [personalProfile, setPersonalProfile] = useState({
    type: user?.humanDesignType || 'Generator',
    strategy: user?.strategy || 'To Respond',
    authority: user?.authority || 'Sacral',
    profile: user?.profile || '6/2 Role Model Hermit'
  });

  // For editing personal profile
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setPersonalProfile(prev => ({...prev, [name]: value}));
  };

  const handleSaveProfile = () => {
    try {
      localStorage.setItem('userHumanDesign', JSON.stringify(personalProfile));
      console.log('Human Design profile saved:', personalProfile);
      setIsEditing(false);
      alert('Human Design profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    }
  };

  // Load saved profile on component mount
  React.useEffect(() => {
    const savedProfile = localStorage.getItem('userHumanDesign');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setPersonalProfile(parsed);
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
  }, []);

  // Mock student data - ONLY for instructors
  const students = isInstructor() ? [
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
      joinDate: '2024-02-10',
      lastSession: '2024-05-19',
      progress: 60,
      currentGoals: ['Master Frenzel technique', 'Compete in local event'],
      strengths: ['Analytical approach', 'Good technique'],
      challenges: ['Energy management', 'Overanalysis'],
      preferredStyle: 'Detailed explanations with recognition'
    },
    {
      id: 3,
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      type: 'Manifestor',
      authority: 'Splenic',
      profile: '8/1 Role Model Investigator',
      level: 'Advanced',
      joinDate: '2024-01-05',
      lastSession: '2024-05-20',
      progress: 90,
      currentGoals: ['Reach 40m depth', 'Teach others'],
      strengths: ['Natural leadership', 'Intuitive safety'],
      challenges: ['Impatience with others', 'Need for autonomy'],
      preferredStyle: 'Independent practice with minimal guidance'
    }
  ] : [];

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

  // Strategy descriptions
  const strategyDescriptions = {
    'To Respond': 'Wait for life to present opportunities and respond with your gut feeling',
    'To Inform': 'Keep others informed of your actions and decisions to avoid resistance',
    'To Wait for the Invitation': 'Wait to be recognized and invited before sharing your gifts',
    'To Wait a Lunar Cycle': 'Take a full lunar cycle (28 days) before making major decisions'
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

  // Student detail view - ONLY for instructors
  const renderStudentDetail = () => {
    if (!selectedStudent || !isInstructor()) return null;

    const recommendations = getTrainingRecommendations(selectedStudent.type, selectedStudent.authority);

    return (
      <div className="space-y-8">
        {/* Student Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h3>
                <p className="text-gray-600">{selectedStudent.level} • {selectedStudent.type} • {selectedStudent.authority}</p>
                <p className="text-sm text-gray-500">Last session: {selectedStudent.lastSession}</p>
              </div>
            </div>
            <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <SafeIcon icon={FiX} className="text-gray-600" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Human Design Profile</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-ocean-600">{selectedStudent.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Authority:</span>
                  <span className="font-medium text-coral-600">{selectedStudent.authority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile:</span>
                  <span className="font-medium text-purple-600">{selectedStudent.profile}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Current Progress</h4>
              <div className="mb-2 flex justify-between">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm font-medium text-ocean-600">{selectedStudent.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-ocean-600 h-2 rounded-full" style={{width: `${selectedStudent.progress}%`}}></div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Current Goals</h4>
              <ul className="space-y-1">
                {selectedStudent.currentGoals.map((goal, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <SafeIcon icon={FiTarget} className="text-ocean-500 mt-1 text-sm" />
                    <span className="text-gray-700 text-sm">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Training Recommendations */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Human Design-Based Training Recommendations
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Optimal Approach</h4>
                <p className="text-gray-700">{recommendations.approach}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recommended Pacing</h4>
                <p className="text-gray-700">{recommendations.pacing}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Coaching Style</h4>
                <p className="text-gray-700">{recommendations.coaching}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recommended Techniques</h4>
                <ul className="space-y-1">
                  {recommendations.techniques.map((technique, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="text-green-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">{technique}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Ideal Session Structure</h4>
                <p className="text-gray-700">{recommendations.sessions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Challenges */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <SafeIcon icon={FiCheckCircle} className="text-green-500" />
              <span>Strengths</span>
            </h4>
            <ul className="space-y-2">
              {selectedStudent.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <SafeIcon icon={FiTarget} className="text-green-500 mt-1 text-sm" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <SafeIcon icon={FiAlertCircle} className="text-coral-500" />
              <span>Challenges</span>
            </h4>
            <ul className="space-y-2">
              {selectedStudent.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <SafeIcon icon={FiTarget} className="text-coral-500 mt-1 text-sm" />
                  <span className="text-gray-700">{challenge}</span>
                </li>
              ))}
            </ul>
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
            className="flex-1 border border-ocean-600 text-ocean-600 py-3 rounded-lg font-medium hover:bg-ocean-50 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiCalendar} />
            <span>Plan Session</span>
          </button>
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
                  placeholder="e.g., 6/2 Role Model Hermit"
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
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Type: {personalProfile.type}</h3>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4 text-lg leading-relaxed">
            <strong>As a {personalProfile.type} in freediving:</strong>
          </p>
          <p className="mb-4">
            {typeDescriptions[personalProfile.type] || "Your type description will appear here once you've selected a type."}
          </p>
        </div>
      </div>

      {/* Strategy Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Strategy: {personalProfile.strategy}</h3>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">
            <strong>Your optimal approach to freediving decisions:</strong>
          </p>
          <p className="mb-4">
            {strategyDescriptions[personalProfile.strategy] || "Your strategy description will appear here once you've selected a strategy."}
          </p>
        </div>
      </div>

      {/* Authority Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Authority: {personalProfile.authority}</h3>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">
            <strong>Your decision-making process for freediving:</strong>
          </p>
          <p className="mb-4">
            {authorityDescriptions[personalProfile.authority] || "Your authority description will appear here once you've selected an authority."}
          </p>
        </div>
      </div>
    </div>
  );

  const renderPersonalRecommendations = () => {
    const recommendations = getTrainingRecommendations(personalProfile.type, personalProfile.authority);

    return (
      <div className="space-y-8">
        <h3 className="text-xl font-bold text-gray-900">Personalized Freediving Recommendations</h3>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-ocean-900 mb-4 flex items-center space-x-2">
            <SafeIcon icon={FiTarget} className="text-ocean-600" />
            <span>Training Approach for {personalProfile.type} with {personalProfile.authority} Authority</span>
          </h4>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Primary Approach</h5>
                <p className="text-gray-700">{recommendations.approach}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Optimal Pacing</h5>
                <p className="text-gray-700">{recommendations.pacing}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Session Structure</h5>
                <p className="text-gray-700">{recommendations.sessions}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Recommended Techniques</h5>
                <ul className="space-y-2">
                  {recommendations.techniques.map((technique, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="text-green-500 mt-1 text-sm" />
                      <span className="text-gray-700 text-sm">{technique}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Coaching Style</h5>
                <p className="text-gray-700">{recommendations.coaching}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specific Recommendations by Type */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-ocean-900 mb-4">Specific Recommendations for Your Design</h4>

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
                <h5 className="font-medium text-gray-900 mb-2">Decision-Making in Freediving</h5>
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
  };

  // Instructor dashboard - ONLY for instructors
  const renderInstructorDashboard = () => {
    if (!isInstructor()) return null;

    return (
      <div className="space-y-8">
        {/* Students Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(student => (
            <motion.div
              key={student.id}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
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
      </div>
    );
  };

  const renderTabContent = () => {
    // Only instructors can see the instructor-specific tabs
    if (isInstructor()) {
      switch (activeTab) {
        case 'students':
          return selectedStudent ? renderStudentDetail() : renderInstructorDashboard();
        case 'guidance':
          return (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Guidance Engine</h3>
              <p className="text-gray-600">Advanced coaching tools and recommendations based on Human Design principles.</p>
            </div>
          );
        default:
          return renderInstructorDashboard();
      }
    } else {
      // For students and members, only show their own profile content
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
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isInstructor() ? 'Human Design Coaching Platform' : 'Your Human Design Blueprint'}
          </h1>
          <p className="text-gray-600">
            {isInstructor()
              ? 'Personalize your coaching approach using Human Design principles'
              : 'Discover your unique energetic design and personalized freediving approach'}
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.1}}
          className="bg-white rounded-xl shadow-lg mb-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {isInstructor() ? (
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
                    <span>Your Profile</span>
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
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}}>
          {renderTabContent()}
        </motion.div>

        {/* Privacy & Information Notice */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.3}}
          className="mt-8 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-purple-900 mb-4">
            {isInstructor() ? 'Instructor Integration' : 'Privacy & Control'}
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-purple-700">
            {isInstructor() ? (
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
                  <h4 className="font-medium mb-2">Your Data</h4>
                  <ul className="space-y-1">
                    <li>• Your Human Design information is stored locally</li>
                    <li>• You control who can access your design details</li>
                    <li>• Update your information anytime</li>
                    <li>• All recommendations are personalized to you</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">For Your Instructors</h4>
                  <ul className="space-y-1">
                    <li>• Instructors can tailor coaching to your type</li>
                    <li>• Better understanding of your learning style</li>
                    <li>• Personalized training recommendations</li>
                    <li>• Respect for your natural energy patterns</li>
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