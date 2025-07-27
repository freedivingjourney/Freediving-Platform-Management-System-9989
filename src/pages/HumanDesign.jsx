import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useAuth} from '../contexts/AuthContext';
import {useRole, PERMISSIONS} from '../contexts/RoleContext';
import ProtectedRoute from '../components/ProtectedRoute';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const {
  FiHeart, FiUser, FiTarget, FiCompass, FiBook, FiStar, FiCalendar, FiClock, FiActivity, FiUsers,
  FiEdit3, FiPlus, FiDownload, FiUpload, FiSettings, FiPlay, FiPause, FiRefreshCw, FiCheckCircle,
  FiAlertCircle, FiInfo, FiSave, FiX, FiFilter, FiClipboard, FiFlag, FiThumbsUp, FiZap, FiMessageCircle,
  FiHelpCircle, FiUserCheck, FiSearch
} = FiIcons;

const HumanDesign = () => {
  const {user} = useAuth();
  const {isInstructor, hasPermission} = useRole();
  
  // For students, always show overview tab. For instructors, default to students tab
  const [activeTab, setActiveTab] = useState(isInstructor() ? 'students' : 'overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showTrainingPlan, setShowTrainingPlan] = useState(false);
  const [showSessionPlanner, setShowSessionPlanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterAuthority, setFilterAuthority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // For personal profile - initialize from user data or defaults
  const [personalProfile, setPersonalProfile] = useState({
    type: user?.humanDesignType || 'Generator',
    strategy: user?.strategy || 'To Respond',
    authority: user?.authority || 'Sacral',
    profile: user?.profile || '6/2 Role Model Hermit',
    description: '',
    strengths: [],
    challenges: [],
    opportunities: [],
    learningStylePreference: '',
    coachingPreference: '',
    diveBuddyRelationship: '',
    customNotes: ''
  });

  // For editing personal profile
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setPersonalProfile(prev => ({...prev, [name]: value}));
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({...prev, [name]: null}));
    }
  };

  const handleMultiInputChange = (name, value) => {
    setPersonalProfile(prev => ({...prev, [name]: value}));
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({...prev, [name]: null}));
    }
  };

  const handleAddListItem = (field, newItem) => {
    if (newItem.trim() === '') return;
    setPersonalProfile(prev => ({...prev, [field]: [...prev[field], newItem.trim()]}));
  };

  const handleRemoveListItem = (field, index) => {
    setPersonalProfile(prev => ({...prev, [field]: prev[field].filter((_, i) => i !== index)}));
  };

  const validateForm = () => {
    const errors = {};
    if (!personalProfile.type) errors.type = 'Type is required';
    if (!personalProfile.authority) errors.authority = 'Authority is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Update profile in Supabase
      const {data, error} = await supabase
        .from('user_profiles')
        .upsert({user_id: user.id, human_design: personalProfile}, {onConflict: 'user_id'});
      if (error) throw error;
      
      // Update local storage
      localStorage.setItem('userHumanDesign', JSON.stringify(personalProfile));
      setIsEditing(false);
      // Show success notification
      alert('Human Design profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load saved profile from Supabase on component mount
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        // First try to get from Supabase
        const {data, error} = await supabase
          .from('user_profiles')
          .select('human_design')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data?.human_design) {
          setPersonalProfile(data.human_design);
        } else {
          // Fall back to localStorage
          const savedProfile = localStorage.getItem('userHumanDesign');
          if (savedProfile) {
            try {
              const parsed = JSON.parse(savedProfile);
              setPersonalProfile(parsed);
            } catch (error) {
              console.error('Error parsing saved profile:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  // Fetch student profiles for instructors
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!isInstructor()) return;
      
      setLoadingStudents(true);
      try {
        const {data, error} = await supabase
          .from('user_profiles')
          .select(`
            *,
            users:user_id (
              name,
              email,
              avatar,
              role,
              certifications,
              joinDate,
              lastActive
            )
          `)
          .in('users.role', ['student', 'member']);
        
        if (error) throw error;
        
        // Transform data to match our expected format
        const transformedData = data.map(profile => ({
          id: profile.user_id,
          name: profile.users.name,
          email: profile.users.email,
          avatar: profile.users.avatar,
          role: profile.users.role,
          joinDate: profile.users.joinDate,
          lastActive: profile.users.lastActive,
          certifications: profile.users.certifications,
          type: profile.human_design?.type || 'Not set',
          authority: profile.human_design?.authority || 'Not set',
          profile: profile.human_design?.profile || 'Not set',
          description: profile.human_design?.description || '',
          strengths: profile.human_design?.strengths || [],
          challenges: profile.human_design?.challenges || [],
          opportunities: profile.human_design?.opportunities || [],
          learningStylePreference: profile.human_design?.learningStylePreference || '',
          coachingPreference: profile.human_design?.coachingPreference || '',
          diveBuddyRelationship: profile.human_design?.diveBuddyRelationship || '',
          level: profile.level || 'Beginner',
          progress: profile.progress || 0,
          currentGoals: profile.currentGoals || [],
          preferredStyle: profile.human_design?.learningStylePreference || 'Not specified'
        }));
        
        setStudents(transformedData);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoadingStudents(false);
      }
    };
    
    if (isInstructor()) {
      fetchStudents();
    }
  }, [isInstructor]);

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || student.type === filterType;
    const matchesAuthority = filterAuthority === 'all' || student.authority === filterAuthority;
    return matchesSearch && matchesType && matchesAuthority;
  });

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

  // Type details for profile
  const typeDetails = {
    'Generator': {
      description: 'Passionate, dependable freediver who thrives on skill mastery and high engagement in training.',
      strengths: [
        'Sustained energy for consistent practice',
        'Rapid skill development',
        'Inspires group motivation',
        'Excels with clear routines'
      ],
      challenges: [
        'Risk of taking on too much',
        'Trouble saying no',
        'Filling time with less meaningful dives',
        'Feelings of guilt over rest or self-prioritization'
      ],
      opportunities: [
        'Develop boundaries',
        'Focus on passion-driven goals',
        'Delegate',
        'Request help for non-core tasks'
      ],
      learningStylePreference: 'Hands-on, incremental drills; repetition and clear feedback loops.',
      coachingPreference: 'Supportive structure, regular encouragement, tracking skill progress, periodic energy check-ins.',
      diveBuddyRelationship: 'Those who respect personal interests, energy boundaries, and reciprocate enthusiasm.'
    },
    'Manifesting Generator': {
      description: 'Dynamic freediver who multitasks, adapts quickly, and innovates routines.',
      strengths: [
        'Learns fast',
        'Switches skills efficiently',
        'Energizes training groups',
        'Pioneers new methods'
      ],
      challenges: [
        'Difficulty finishing started tasks',
        'Over-committing',
        'Becoming bored with single-focus practice',
        'Inconsistency'
      ],
      opportunities: [
        'Encourage flexible training',
        'Allow rapid skill pivots',
        'Streamline session goals'
      ],
      learningStylePreference: 'Variety-driven, parallel goal-tracking, freedom to shift focus mid-session.',
      coachingPreference: 'Adaptive, minimum constraint, permission for self-paced learning.',
      diveBuddyRelationship: 'Flexible, open-minded teammates supportive of changing plans.'
    },
    'Projector': {
      description: 'Observant, systems-oriented diver excelling at seeing patterns and improving dive efficiency.',
      strengths: [
        'Sharp analytical skills',
        'Insightful coach and mentor',
        'Refines group techniques'
      ],
      challenges: [
        'Energy drains when overworking',
        'Feeling underappreciated',
        'Burnout from lack of rest',
        'Sensitivity to team dynamics'
      ],
      opportunities: [
        'Focus on strategic roles',
        'Get recognized for contributions',
        'Allow restorative breaks'
      ],
      learningStylePreference: 'Personalized feedback, 1-on-1 analysis, observation, and reflection.',
      coachingPreference: 'Wait for invitation to advise, deep listening, highlight unique perspectives.',
      diveBuddyRelationship: 'Teammates who appreciate insight, offer recognition, and respect alone time.'
    },
    'Manifestor': {
      description: 'Independent and bold freediver who initiates new exploration and inspires the group.',
      strengths: [
        'Initiator of new dive plans',
        'Fearless',
        'Thrives in uncharted situations',
        'Innovative thinker'
      ],
      challenges: [
        'Weary in routine or administrative details',
        'Potential for overextension',
        'Prefers solo preparation'
      ],
      opportunities: [
        'Encourage initiating dives',
        'Provide lead roles in planning',
        'Respect independence'
      ],
      learningStylePreference: 'Self-driven, project-based practice, autonomy in skill development.',
      coachingPreference: 'Minimal micromanagement, opportunities to lead, straightforward feedback.',
      diveBuddyRelationship: 'Respectful supporters, allow space, value initiative, avoid intrusion.'
    },
    'Reflector': {
      description: 'Sensitive, objective freediver attuned to the group\'s energetic and environmental dynamics.',
      strengths: [
        'Community pulse-reader',
        'Adapts to various conditions',
        'Offers deep insights and feedback'
      ],
      challenges: [
        'Prone to environmental overwhelm',
        'Confusion between own and others\' energy',
        'Inconsistency'
      ],
      opportunities: [
        'Foster supportive, harmonious training spaces',
        'Schedule sessions in line with comfort'
      ],
      learningStylePreference: 'Group interaction, environmental variety, gradual adjustment to new settings.',
      coachingPreference: 'Flexible, environment-sensitive, empathetic, periodic check-ins over time.',
      diveBuddyRelationship: 'Honest, supportive, recognize need for rest and space, adjust pace as needed.'
    }
  };

  // Authority mapping for coaching approach
  const authorityCoaching = {
    'Sacral': 'Allow spontaneous feedback, respect instant choices',
    'Emotional': 'Give reflection opportunities, no rush',
    'Splenic': 'Trust quick calls, encourage mindfulness, solo checks',
    'Self-Projected': 'Offer voice journaling, debrief, active listening',
    'Ego': 'Align goals with motivation, check commitment',
    'Mental': 'Foster open dialogue, ask open-ended questions',
    'Lunar': 'Give extra time for choices, gradual exposure'
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

    // Try to get the specific type+authority combination
    if (recommendations[type]?.[authority]) {
      return recommendations[type][authority];
    }

    // If not found, return a generic recommendation for the type
    const typeKeys = Object.keys(recommendations[type] || {});
    if (typeKeys.length > 0) {
      return recommendations[type][typeKeys[0]];
    }

    // If type not found, return default
    return {
      approach: 'Personalized approach needed',
      pacing: 'Individual assessment required',
      techniques: ['Standard techniques'],
      coaching: 'Adapt to individual needs',
      sessions: 'Regular sessions'
    };
  };

  // Determine role badge for dive buddy relationship based on type
  const getDiveBuddyRole = (type) => {
    const roles = {
      'Generator': 'Reliable Partner',
      'Manifesting Generator': 'Dynamic Explorer',
      'Projector': 'Technical Guide',
      'Manifestor': 'Independent Leader',
      'Reflector': 'Environmental Sensor'
    };
    return roles[type] || 'Dive Buddy';
  };

  // Get risk flags for students based on type and authority
  const getRiskFlags = (student) => {
    const flags = [];

    // Type-based flags
    if (student.type === 'Generator') {
      flags.push({icon: FiActivity, color: 'yellow', text: 'May overwork without breaks'});
    }
    if (student.type === 'Projector') {
      flags.push({icon: FiClock, color: 'red', text: 'Needs frequent rest periods'});
    }
    if (student.type === 'Reflector') {
      flags.push({icon: FiUsers, color: 'blue', text: 'Environment sensitive'});
    }

    // Authority-based flags
    if (student.authority === 'Emotional') {
      flags.push({icon: FiHeart, color: 'purple', text: 'Wait for emotional clarity'});
    }
    if (student.authority === 'Splenic') {
      flags.push({icon: FiTarget, color: 'green', text: 'Trust immediate intuition'});
    }

    return flags;
  };

  // Student detail view - ONLY for instructors
  const renderStudentDetail = () => {
    if (!selectedStudent || !isInstructor()) return null;

    const recommendations = getTrainingRecommendations(selectedStudent.type, selectedStudent.authority);
    const riskFlags = getRiskFlags(selectedStudent);
    const diveBuddyRole = getDiveBuddyRole(selectedStudent.type);

    return (
      <div className="space-y-8">
        {/* Student Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{selectedStudent.level} • </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">{selectedStudent.type}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-sm">{selectedStudent.authority}</span>
                </div>
                <p className="text-sm text-gray-500">Last session: {selectedStudent.lastActive}</p>
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Dive Buddy Role:</span>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-sm">{diveBuddyRole}</span>
                </div>
              </div>

              {/* Risk flags */}
              {riskFlags.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Coaching Flags</h4>
                  <div className="flex flex-wrap gap-2">
                    {riskFlags.map((flag, idx) => (
                      <div key={idx} className={`flex items-center space-x-1 px-2 py-1 rounded bg-${flag.color}-50 text-${flag.color}-800 text-xs`}>
                        <SafeIcon icon={flag.icon} className={`text-${flag.color}-500`} />
                        <span>{flag.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Current Progress</h4>
              <div className="mb-2 flex justify-between">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm font-medium text-ocean-600">{selectedStudent.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-ocean-600 h-2 rounded-full"
                  style={{width: `${selectedStudent.progress}%`}}
                ></div>
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

        {/* Freediver Description */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Freediver Profile
          </h3>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700">
              {selectedStudent.description || typeDetails[selectedStudent.type]?.description || 'No description available.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <SafeIcon icon={FiThumbsUp} className="text-green-500" />
                <span>Strengths</span>
              </h4>
              <ul className="space-y-1">
                {(selectedStudent.strengths?.length > 0 ? selectedStudent.strengths : typeDetails[selectedStudent.type]?.strengths || [])
                  .map((strength, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="text-green-500 mt-1 text-xs" />
                      <span className="text-gray-700 text-sm">{strength}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <SafeIcon icon={FiAlertCircle} className="text-red-500" />
                <span>Challenges</span>
              </h4>
              <ul className="space-y-1">
                {(selectedStudent.challenges?.length > 0 ? selectedStudent.challenges : typeDetails[selectedStudent.type]?.challenges || [])
                  .map((challenge, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <SafeIcon icon={FiFlag} className="text-red-500 mt-1 text-xs" />
                      <span className="text-gray-700 text-sm">{challenge}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="text-blue-500" />
                <span>Opportunities</span>
              </h4>
              <ul className="space-y-1">
                {(selectedStudent.opportunities?.length > 0 ? selectedStudent.opportunities : typeDetails[selectedStudent.type]?.opportunities || [])
                  .map((opportunity, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-blue-500 mt-1 text-xs" />
                      <span className="text-gray-700 text-sm">{opportunity}</span>
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
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Learning Style</h4>
                <p className="text-gray-700">
                  {selectedStudent.learningStylePreference || typeDetails[selectedStudent.type]?.learningStylePreference || 'Individual assessment required.'}
                </p>
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
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Coaching Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(recommendations.coaching)}
                    className="bg-ocean-100 text-ocean-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-ocean-200 flex items-center space-x-1"
                  >
                    <SafeIcon icon={FiClipboard} />
                    <span>Copy Coaching Tips</span>
                  </button>
                  <button
                    onClick={() => setShowSessionPlanner(true)}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 flex items-center space-x-1"
                  >
                    <SafeIcon icon={FiCalendar} />
                    <span>Plan Session</span>
                  </button>
                </div>
              </div>
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
            onClick={() => setShowProfileModal(true)}
            className="flex-1 border border-ocean-600 text-ocean-600 py-3 rounded-lg font-medium hover:bg-ocean-50 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiEdit3} />
            <span>Edit Profile</span>
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
            className={`flex items-center space-x-2 ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-ocean-600 hover:bg-ocean-700'} text-white px-4 py-2 rounded-lg transition-colors`}
            disabled={loading}
          >
            {loading ? (
              <SafeIcon icon={FiRefreshCw} className="animate-spin" />
            ) : (
              <SafeIcon icon={isEditing ? FiSave : FiEdit3} />
            )}
            <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              {isEditing ? (
                <div>
                  <select
                    name="type"
                    value={personalProfile.type}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${formErrors.type ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-ocean-500 focus:border-ocean-500'} rounded-lg`}
                  >
                    <option value="">Select Type</option>
                    <option value="Generator">Generator</option>
                    <option value="Manifestor">Manifestor</option>
                    <option value="Projector">Projector</option>
                    <option value="Reflector">Reflector</option>
                    <option value="Manifesting Generator">Manifesting Generator</option>
                  </select>
                  {formErrors.type && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
                  )}
                </div>
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
                <div>
                  <select
                    name="authority"
                    value={personalProfile.authority}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${formErrors.authority ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-ocean-500 focus:border-ocean-500'} rounded-lg`}
                  >
                    <option value="">Select Authority</option>
                    <option value="Emotional">Emotional</option>
                    <option value="Sacral">Sacral</option>
                    <option value="Splenic">Splenic</option>
                    <option value="Self-Projected">Self-Projected</option>
                    <option value="Ego">Ego</option>
                    <option value="Lunar">Lunar</option>
                  </select>
                  {formErrors.authority && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.authority}</p>
                  )}
                </div>
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

        {isEditing && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Freediver Profile Details</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Character & energy as a freediver)
                </label>
                <textarea
                  name="description"
                  value={personalProfile.description}
                  onChange={handleInputChange}
                  placeholder="Describe your character and energy as a freediver..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Strengths
                  </label>
                  <div className="space-y-2">
                    {personalProfile.strengths.map((strength, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="text-sm">{strength}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveListItem('strengths', idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <SafeIcon icon={FiX} className="text-xs" />
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add strength..."
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddListItem('strengths', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousSibling;
                          handleAddListItem('strengths', input.value);
                          input.value = '';
                        }}
                        className="bg-ocean-600 text-white p-2 rounded-lg hover:bg-ocean-700 transition-colors"
                      >
                        <SafeIcon icon={FiPlus} className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenges
                  </label>
                  <div className="space-y-2">
                    {personalProfile.challenges.map((challenge, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="text-sm">{challenge}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveListItem('challenges', idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <SafeIcon icon={FiX} className="text-xs" />
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add challenge..."
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddListItem('challenges', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousSibling;
                          handleAddListItem('challenges', input.value);
                          input.value = '';
                        }}
                        className="bg-ocean-600 text-white p-2 rounded-lg hover:bg-ocean-700 transition-colors"
                      >
                        <SafeIcon icon={FiPlus} className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opportunities
                  </label>
                  <div className="space-y-2">
                    {personalProfile.opportunities.map((opportunity, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="text-sm">{opportunity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveListItem('opportunities', idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <SafeIcon icon={FiX} className="text-xs" />
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add opportunity..."
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddListItem('opportunities', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousSibling;
                          handleAddListItem('opportunities', input.value);
                          input.value = '';
                        }}
                        className="bg-ocean-600 text-white p-2 rounded-lg hover:bg-ocean-700 transition-colors"
                      >
                        <SafeIcon icon={FiPlus} className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Style Preference
                  </label>
                  <textarea
                    name="learningStylePreference"
                    value={personalProfile.learningStylePreference}
                    onChange={handleInputChange}
                    placeholder="How you absorb new freediving techniques/knowledge best..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coaching Preference
                  </label>
                  <textarea
                    name="coachingPreference"
                    value={personalProfile.coachingPreference}
                    onChange={handleInputChange}
                    placeholder="Optimal feedback & encouragement style..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dive Buddy Relationship
                  </label>
                  <textarea
                    name="diveBuddyRelationship"
                    value={personalProfile.diveBuddyRelationship}
                    onChange={handleInputChange}
                    placeholder="Preferred role and dynamic within a freediving team/buddy system..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Notes
                </label>
                <textarea
                  name="customNotes"
                  value={personalProfile.customNotes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes about your Human Design profile..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
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

      {/* Freediver Profile */}
      {!isEditing && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Freediver Profile</h3>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700">
              {personalProfile.description || typeDetails[personalProfile.type]?.description || 'No description available.'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <SafeIcon icon={FiThumbsUp} className="text-green-500" />
                <span>Strengths</span>
              </h4>
              <ul className="space-y-1">
                {(personalProfile.strengths?.length > 0 ? personalProfile.strengths : typeDetails[personalProfile.type]?.strengths || [])
                  .map((strength, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="text-green-500 mt-1 text-xs" />
                      <span className="text-gray-700 text-sm">{strength}</span>
                    </li>
                  ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <SafeIcon icon={FiAlertCircle} className="text-red-500" />
                <span>Challenges</span>
              </h4>
              <ul className="space-y-1">
                {(personalProfile.challenges?.length > 0 ? personalProfile.challenges : typeDetails[personalProfile.type]?.challenges || [])
                  .map((challenge, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <SafeIcon icon={FiFlag} className="text-red-500 mt-1 text-xs" />
                      <span className="text-gray-700 text-sm">{challenge}</span>
                    </li>
                  ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="text-blue-500" />
                <span>Opportunities</span>
              </h4>
              <ul className="space-y-1">
                {(personalProfile.opportunities?.length > 0 ? personalProfile.opportunities : typeDetails[personalProfile.type]?.opportunities || [])
                  .map((opportunity, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-blue-500 mt-1 text-xs" />
                      <span className="text-gray-700 text-sm">{opportunity}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Learning Style Preference</h4>
              <p className="text-gray-700">
                {personalProfile.learningStylePreference || typeDetails[personalProfile.type]?.learningStylePreference || 'No preference specified.'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Coaching Preference</h4>
              <p className="text-gray-700">
                {personalProfile.coachingPreference || typeDetails[personalProfile.type]?.coachingPreference || 'No preference specified.'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Dive Buddy Relationship</h4>
              <p className="text-gray-700">
                {personalProfile.diveBuddyRelationship || typeDetails[personalProfile.type]?.diveBuddyRelationship || 'No preference specified.'}
              </p>
            </div>
          </div>
          
          {personalProfile.customNotes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Custom Notes</h4>
              <p className="text-gray-700">{personalProfile.customNotes}</p>
            </div>
          )}
        </div>
      )}
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
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Types</option>
                <option value="Generator">Generators</option>
                <option value="Manifestor">Manifestors</option>
                <option value="Projector">Projectors</option>
                <option value="Reflector">Reflectors</option>
                <option value="Manifesting Generator">Manifesting Generators</option>
              </select>
            </div>
            
            <div className="relative">
              <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterAuthority}
                onChange={(e) => setFilterAuthority(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Authorities</option>
                <option value="Emotional">Emotional</option>
                <option value="Sacral">Sacral</option>
                <option value="Splenic">Splenic</option>
                <option value="Self-Projected">Self-Projected</option>
                <option value="Ego">Ego</option>
                <option value="Lunar">Lunar</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Students Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingStudents ? (
            <div className="col-span-3 text-center py-12">
              <SafeIcon icon={FiRefreshCw} className="text-3xl text-ocean-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="col-span-3 text-center py-12 bg-white rounded-xl shadow-lg">
              <SafeIcon icon={FiUsers} className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No students found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredStudents.map(student => (
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
                
                {/* Risk flags */}
                {getRiskFlags(student).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {getRiskFlags(student).slice(0, 2).map((flag, idx) => (
                      <div key={idx} className={`flex items-center space-x-1 px-2 py-1 rounded bg-${flag.color}-50 text-${flag.color}-800 text-xs`}>
                        <SafeIcon icon={flag.icon} className={`text-${flag.color}-500`} />
                        <span>{flag.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Coaching recommendations hint */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-ocean-600">
                    <SafeIcon icon={FiMessageCircle} />
                    <span>Coaching approach: {authorityCoaching[student.authority]}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderGuidanceEngine = () => {
    if (!isInstructor()) return null;
    
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Human Design Coaching Guidance</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                  <SafeIcon icon={FiTarget} className="text-blue-600" />
                  <span>Type-Based Coaching</span>
                </h4>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-1">Generators</h5>
                    <p className="text-sm text-gray-700">
                      Focus on: Sustainable energy management, satisfaction, response-based decisions
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                        Gut response
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                        Regular practice
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                        Energy management
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-1">Projectors</h5>
                    <p className="text-sm text-gray-700">
                      Focus on: Energy conservation, recognition, invitation-based engagement
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        Rest periods
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        Technique focus
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        Invitation-based
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-1">Manifestors</h5>
                    <p className="text-sm text-gray-700">
                      Focus on: Autonomy, initiative, informing others
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                        Self-directed
                      </span>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                        Initiative
                      </span>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                        Independence
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center space-x-2">
                  <SafeIcon icon={FiHeart} className="text-purple-600" />
                  <span>Authority-Based Guidance</span>
                </h4>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-1">Emotional Authority</h5>
                    <p className="text-sm text-gray-700">
                      Coaching approach: Support emotional clarity, patience with decisions
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                        Wait for clarity
                      </span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                        Process emotions
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-1">Sacral Authority</h5>
                    <p className="text-sm text-gray-700">
                      Coaching approach: Ask yes/no questions, honor gut responses
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                        Yes/no questions
                      </span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                        Gut response
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-1">Splenic Authority</h5>
                    <p className="text-sm text-gray-700">
                      Coaching approach: Trust in-the-moment intuition, safety awareness
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                        Present moment
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                        Intuitive safety
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Session Planning Tools</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <button className="bg-ocean-600 text-white p-4 rounded-lg hover:bg-ocean-700 transition-colors flex flex-col items-center">
                <SafeIcon icon={FiCalendar} className="text-2xl mb-2" />
                <span className="font-medium">Create New Session Plan</span>
              </button>
              
              <button className="bg-ocean-100 text-ocean-800 p-4 rounded-lg hover:bg-ocean-200 transition-colors flex flex-col items-center">
                <SafeIcon icon={FiUsers} className="text-2xl mb-2" />
                <span className="font-medium">Group Planning Assistant</span>
              </button>
              
              <button className="bg-ocean-100 text-ocean-800 p-4 rounded-lg hover:bg-ocean-200 transition-colors flex flex-col items-center">
                <SafeIcon icon={FiDownload} className="text-2xl mb-2" />
                <span className="font-medium">Download Templates</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Human Design Reference Guide</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Training Adaptations</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <SafeIcon icon={FiUserCheck} className="text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Generator Students</h5>
                    <p className="text-sm text-gray-600">
                      Provide sustainable, engaging practice with clear structure. Allow them to respond rather than initiate.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 rounded-full p-2 mt-1">
                    <SafeIcon icon={FiZap} className="text-red-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Manifestor Students</h5>
                    <p className="text-sm text-gray-600">
                      Respect their independence, provide space for initiative, and include rest periods between intense sessions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 rounded-full p-2 mt-1">
                    <SafeIcon icon={FiTarget} className="text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Projector Students</h5>
                    <p className="text-sm text-gray-600">
                      Focus on technique rather than endurance, recognize their insights, and ensure adequate rest periods.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Authority-Based Coaching</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-100 rounded-full p-2 mt-1">
                    <SafeIcon icon={FiHeart} className="text-yellow-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Emotional Authority</h5>
                    <p className="text-sm text-gray-600">
                      Allow time for emotional clarity before committing to challenging dives or new depth goals. Never pressure during emotional lows.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-2 mt-1">
                    <SafeIcon icon={FiCheckCircle} className="text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Sacral Authority</h5>
                    <p className="text-sm text-gray-600">
                      Ask yes/no questions about diving opportunities and training intensity. Honor their gut responses.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-indigo-100 rounded-full p-2 mt-1">
                    <SafeIcon icon={FiActivity} className="text-indigo-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Splenic Authority</h5>
                    <p className="text-sm text-gray-600">
                      Trust their in-the-moment intuition about dive safety. Encourage mindfulness and present-moment awareness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          return renderGuidanceEngine();
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
    <ProtectedRoute>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>

          {/* Privacy & Information Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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
                      <li>• Your Human Design information is stored securely</li>
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

      {/* Training Plan Modal */}
      <AnimatePresence>
        {showTrainingPlan && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTrainingPlan(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Training Plan for {selectedStudent.name}
                </h2>
                <button
                  onClick={() => setShowTrainingPlan(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-xl text-gray-400" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="bg-ocean-50 border-l-4 border-ocean-500 p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiInfo} className="text-ocean-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ocean-900 mb-1">Human Design-Informed Plan</h3>
                      <p className="text-ocean-700">
                        This training plan is customized for {selectedStudent.name}'s {selectedStudent.type} energy type with {selectedStudent.authority} authority.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">8-Week Progressive Training Plan</h3>
                    <div className="space-y-4">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-ocean-900 mb-2">Weeks 1-2: Foundation Building</h4>
                        <p className="text-gray-700 mb-3">
                          {selectedStudent.type === 'Generator' && 'Focus on building consistent energy management through regular, satisfying practice.'}
                          {selectedStudent.type === 'Manifestor' && 'Establish autonomy in training approach with clear goals and independent practice.'}
                          {selectedStudent.type === 'Projector' && 'Emphasize technique refinement and observation with proper rest periods.'}
                          {selectedStudent.type === 'Reflector' && 'Create environmental awareness and adaptability with supportive group dynamics.'}
                          {selectedStudent.type === 'Manifesting Generator' && 'Develop multi-faceted skills with varied, engaging practice sessions.'}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <SafeIcon icon={FiCheckCircle} className="text-green-500 mt-1 text-sm" />
                            <span className="text-gray-700">
                              {selectedStudent.type === 'Generator' && '3-4 sessions per week, 45-60 minutes each with focus on enjoyable practice'}
                              {selectedStudent.type === 'Manifestor' && '2-3 higher intensity sessions per week with adequate rest between'}
                              {selectedStudent.type === 'Projector' && '2-3 focused sessions per week, 30-45 minutes with technique emphasis'}
                              {selectedStudent.type === 'Reflector' && '2 group sessions per week in supportive environment'}
                              {selectedStudent.type === 'Manifesting Generator' && '3-4 varied sessions per week with multiple skill focus'}
                            </span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <SafeIcon icon={FiCheckCircle} className="text-green-500 mt-1 text-sm" />
                            <span className="text-gray-700">
                              {selectedStudent.authority === 'Emotional' && 'Track emotional states before, during, and after sessions'}
                              {selectedStudent.authority === 'Sacral' && 'Check in with gut response before increasing intensity'}
                              {selectedStudent.authority === 'Splenic' && 'Practice in-the-moment safety awareness exercises'}
                              {selectedStudent.authority === 'Self-Projected' && 'Verbal processing of training goals and experiences'}
                              {selectedStudent.authority === 'Ego' && 'Connect training to personal motivation and willpower'}
                              {selectedStudent.authority === 'Lunar' && 'Gradual introduction to different training environments'}
                            </span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <SafeIcon icon={FiCheckCircle} className="text-green-500 mt-1 text-sm" />
                            <span className="text-gray-700">Basic breathing techniques, relaxation practice, and initial static apnea work</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-ocean-900 mb-2">Weeks 3-5: Skill Development</h4>
                        <p className="text-gray-700 mb-3">
                          Progressive training with increasing depth/duration goals aligned with {selectedStudent.name}'s Human Design energy pattern.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <SafeIcon icon={FiCheckCircle} className="text-green-500 mt-1 text-sm" />
                            <span className="text-gray-700">
                              {selectedStudent.type === 'Generator' && 'Progressive static and dynamic training with satisfaction focus'}
                              {selectedStudent.type === 'Manifestor' && 'Self-directed depth progression with instructor oversight'}
                              {selectedStudent.type === 'Projector' && 'Technical refinement of equalization, finning, and streamlining'}
                              {selectedStudent.type === 'Reflector' && 'Exposure to different dive environments with proper adjustment time'}
                              {selectedStudent.type === 'Manifesting Generator' && 'Multiple discipline training with quick transitions'}
                            </span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <SafeIcon icon={FiCheckCircle} className="text-green-500 mt-1 text-sm" />
                            <span className="text-gray-700">
                              Introduction to CO2 and O2 tables customized for {selectedStudent.type} energy management
                            </span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <SafeIcon icon={FiCheckCircle} className="text-green-500 mt-1 text-sm" />
                            <span className="text-gray-700">
                              Buddy system practice with emphasis on {selectedStudent.type}'s natural team dynamic
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-ocean-900 mb-2">Weeks 6-8: Integration & Performance</h4>
                        <p className="text-gray-700 mb-3">
                          Consolidation of skills and preparation for performance goals with Human Design alignment.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <SafeIcon icon={FiCheckCircle} className="text-green-500 mt-1 text-sm" />
                            <span className="text-gray-700">
                              {selectedStudent.type === 'Generator' && 'Consistent depth/time progression with sustainable energy use'}
                              {selectedStudent.type === 'Manifestor' && 'Goal-oriented performance sessions with independence'}
                              {selectedStudent.type === 'Projector' && 'Efficiency-focused sessions with adequate recovery'}
                              {selectedStudent.type === 'Reflector' && 'Integration of experiences across different environments'}
                              {selectedStudent.type === 'Manifesting Generator' && 'Versatile skill application across multiple disciplines'}
                            </span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <SafeIcon icon={FiCheckCircle} className="text-green-500 mt-1 text-sm" />
                            <span className="text-gray-700">
                              Personal best attempts with {selectedStudent.authority}-aligned decision making
                            </span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <SafeIcon icon={FiCheckCircle} className="text-green-500 mt-1 text-sm" />
                            <span className="text-gray-700">
                              Preparation for certification or competition based on individual goals
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Coaching Recommendations</h3>
                    <div className="bg-ocean-50 rounded-lg p-4">
                      <h4 className="font-semibold text-ocean-900 mb-2">Human Design-Based Approach</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <SafeIcon icon={FiMessageCircle} className="text-ocean-600 mt-1" />
                          <div>
                            <h5 className="font-medium text-gray-900">Communication Style</h5>
                            <p className="text-gray-700">
                              {selectedStudent.type === 'Generator' && 'Ask yes/no questions, check for satisfaction'}
                              {selectedStudent.type === 'Manifestor' && 'Give space for self-direction, avoid micromanagement'}
                              {selectedStudent.type === 'Projector' && 'Wait for questions, recognize insights'}
                              {selectedStudent.type === 'Reflector' && 'Patient, supportive conversations'}
                              {selectedStudent.type === 'Manifesting Generator' && 'Engaging, varied communication style'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <SafeIcon icon={FiClock} className="text-ocean-600 mt-1" />
                          <div>
                            <h5 className="font-medium text-gray-900">Session Timing</h5>
                            <p className="text-gray-700">
                              {selectedStudent.type === 'Generator' && 'Regular, consistent sessions with clear structure'}
                              {selectedStudent.type === 'Manifestor' && 'Flexible scheduling with intense work periods and rest'}
                              {selectedStudent.type === 'Projector' && 'Shorter, focused sessions with adequate rest'}
                              {selectedStudent.type === 'Reflector' && 'Align with lunar cycle when possible, consistent environment'}
                              {selectedStudent.type === 'Manifesting Generator' && 'Dynamic sessions with varied activities'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <SafeIcon icon={FiTarget} className="text-ocean-600 mt-1" />
                          <div>
                            <h5 className="font-medium text-gray-900">Goal Setting</h5>
                            <p className="text-gray-700">
                              {selectedStudent.authority === 'Emotional' && 'Allow time for emotional clarity before setting major goals'}
                              {selectedStudent.authority === 'Sacral' && 'Check gut response to potential goals'}
                              {selectedStudent.authority === 'Splenic' && 'Set goals that honor intuitive safety awareness'}
                              {selectedStudent.authority === 'Self-Projected' && 'Have student verbalize goals aloud'}
                              {selectedStudent.authority === 'Ego' && 'Connect goals to personal willpower and motivation'}
                              {selectedStudent.authority === 'Lunar' && 'Set gradual, progressive goals with longer timeframes'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => setShowTrainingPlan(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // In a real app, this would save the plan to the database
                    alert('Training plan saved and shared with student!');
                    setShowTrainingPlan(false);
                  }}
                  className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
                >
                  Save & Share Plan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Planner Modal */}
      <AnimatePresence>
        {showSessionPlanner && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSessionPlanner(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Plan Session for {selectedStudent.name}
                </h2>
                <button
                  onClick={() => setShowSessionPlanner(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-xl text-gray-400" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Type
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent">
                      <option value="pool">Pool Training</option>
                      <option value="openWater">Open Water</option>
                      <option value="theory">Theory & Technique</option>
                      <option value="breathwork">Breathwork</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                    <SafeIcon icon={FiHeart} className="text-blue-600" />
                    <span>Human Design Considerations</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <SafeIcon icon={FiUserCheck} className="text-blue-600 mt-1" />
                      <div>
                        <p className="text-blue-800">
                          <strong>Type:</strong> {selectedStudent.type} - {typeDetails[selectedStudent.type]?.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <SafeIcon icon={FiTarget} className="text-blue-600 mt-1" />
                      <div>
                        <p className="text-blue-800">
                          <strong>Authority:</strong> {selectedStudent.authority} - {authorityCoaching[selectedStudent.authority]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <SafeIcon icon={FiBook} className="text-blue-600 mt-1" />
                      <div>
                        <p className="text-blue-800">
                          <strong>Learning Style:</strong> {selectedStudent.learningStylePreference || typeDetails[selectedStudent.type]?.learningStylePreference}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Session Plan</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-ocean-900">Warm-up (15 min)</h4>
                        <span className="text-sm text-gray-500">15:00</span>
                      </div>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        rows={3}
                        placeholder="Describe warm-up activities..."
                        defaultValue={`${
                          selectedStudent.type === 'Generator' ? 'Progressive engagement warm-up' :
                          selectedStudent.type === 'Manifestor' ? 'Self-directed warm-up with options' :
                          selectedStudent.type === 'Projector' ? 'Guided visualization and gentle stretching' :
                          selectedStudent.type === 'Reflector' ? 'Group-based warm-up in supportive setting' :
                          'Multi-faceted warm-up with variety'
                        }`}
                      ></textarea>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-ocean-900">Main Session (45 min)</h4>
                        <span className="text-sm text-gray-500">45:00</span>
                      </div>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        rows={5}
                        placeholder="Describe main session activities..."
                        defaultValue={`Human Design-informed training focus:
${selectedStudent.type === 'Generator' ? 
'- Consistent practice with clear feedback loops\n- Regular check-ins for satisfaction\n- Progressive challenges based on response' : 
selectedStudent.type === 'Manifestor' ? 
'- Self-directed practice periods\n- Clear goals with autonomy in execution\n- Adequate rest between intense efforts' : 
selectedStudent.type === 'Projector' ? 
'- Technique-focused training with quality over quantity\n- Recognition for insights and observations\n- Shorter sessions with more rest' : 
selectedStudent.type === 'Reflector' ? 
'- Supportive environment with consistent conditions\n- Group harmony and connection\n- Gradual progression with lunar awareness' : 
'- Varied activities with multiple focuses\n- Quick transitions between disciplines\n- Adaptive challenges based on energy'}`}
                      ></textarea>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-ocean-900">Cool-down (15 min)</h4>
                        <span className="text-sm text-gray-500">15:00</span>
                      </div>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        rows={3}
                        placeholder="Describe cool-down activities..."
                        defaultValue={`${
                          selectedStudent.authority === 'Emotional' ? 'Gentle emotional processing exercises with ample reflection time' : 
                          selectedStudent.authority === 'Sacral' ? 'Body-focused relaxation with satisfaction check-ins' :
                          selectedStudent.authority === 'Splenic' ? 'Intuitive stretching, allowing student to follow what feels right' :
                          selectedStudent.authority === 'Self-Projected' ? 'Verbal processing of session experience and insights' :
                          selectedStudent.authority === 'Ego' ? 'Self-directed cool down with recognition of achievements' :
                          'Environmental attunement and gradual transition'
                        }`}
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => setShowSessionPlanner(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
                  >
                    Save Session Plan
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
};

export default HumanDesign;