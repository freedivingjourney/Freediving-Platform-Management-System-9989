import React from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {useAuth} from '../contexts/AuthContext';
import {useApp} from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiActivity,
  FiTarget,
  FiCalendar,
  FiTrendingUp,
  FiCompass,
  FiEdit3,
  FiHeart,
  FiUsers,
  FiShield,
  FiMapPin,
  FiClock,
  FiWind
} = FiIcons;

const Dashboard=()=> {
  const {user}=useAuth();
  const {diveLog,goals}=useApp();

  // Calculate stats from actual data
  const totalDives=diveLog.length;
  const maxDepth=Math.min(...diveLog.filter(dive=> dive.depth).map(dive=> dive.depth),0);
  const maxStatic=diveLog
    .filter(dive=> dive.time_duration)
    .reduce((max,dive)=> {
      const [minutes,seconds]=dive.time_duration.split(':').map(Number);
      const totalSeconds=minutes * 60 + seconds;
      return totalSeconds > max ? totalSeconds : max;
    },0);
  const staticDisplay=maxStatic > 0 ? `${Math.floor(maxStatic / 60)}:${(maxStatic % 60).toString().padStart(2,'0')}` : 'N/A';
  const lastDive=diveLog[0];
  const daysSinceLastDive=lastDive ? Math.floor((new Date() - new Date(lastDive.date)) / (1000 * 60 * 60 * 24)) : 'N/A';
  const completedGoals=goals.filter(goal=> goal.status==='completed').length;
  const totalGoals=goals.length;
  const goalProgress=totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Get most recorded discipline
  const disciplineCounts=diveLog.reduce((acc,dive)=> {
    if (dive.disciplineSubCategory) {
      acc[dive.disciplineSubCategory]=(acc[dive.disciplineSubCategory] || 0) + 1;
    }
    return acc;
  },{});
  const mostRecordedDiscipline=Object.entries(disciplineCounts).length > 0 ? Object.entries(disciplineCounts).sort(([,a],[,b])=> b - a)[0][0] : 'N/A';

  // Get favorite dive site
  const siteCounts=diveLog.reduce((acc,dive)=> {
    if (dive.location) {
      acc[dive.location]=(acc[dive.location] || 0) + 1;
    }
    return acc;
  },{});
  const favoriteSite=Object.entries(siteCounts).length > 0 ? Object.entries(siteCounts).sort(([,a],[,b])=> b - a)[0][0] : 'N/A';

  // Get favorite dive buddy
  const buddyCounts=diveLog.reduce((acc,dive)=> {
    if (dive.diveBuddy) {
      acc[dive.diveBuddy]=(acc[dive.diveBuddy] || 0) + 1;
    }
    return acc;
  },{});
  const favoriteBuddy=Object.entries(buddyCounts).length > 0 ? Object.entries(buddyCounts).sort(([,a],[,b])=> b - a)[0][0] : 'N/A';

  // Get most common dive experience
  const experienceCounts=diveLog.reduce((acc,dive)=> {
    if (dive.experience) {
      acc[dive.experience]=(acc[dive.experience] || 0) + 1;
    }
    return acc;
  },{});
  const mostCommonExperience=Object.entries(experienceCounts).length > 0 ? Object.entries(experienceCounts).sort(([,a],[,b])=> b - a)[0][0] : 'N/A';

  const personalStats=[
    {label: 'Total Dives Logged',value: totalDives,icon: FiActivity,color: 'ocean'},
    {label: 'Current Personal Best (Depth)',value: maxDepth ? `${maxDepth}m` : 'N/A',icon: FiTrendingUp,color: 'coral'},
    {label: 'Days Since Last Dive',value: daysSinceLastDive,icon: FiCalendar,color: 'green'},
    {label: 'Best Static Time',value: staticDisplay,icon: FiClock,color: 'purple'},
    {label: 'Most Recorded Discipline',value: mostRecordedDiscipline,icon: FiTarget,color: 'blue'},
    {label: 'Favorite Dive Site',value: favoriteSite,icon: FiMapPin,color: 'indigo'},
    {label: 'Favorite Dive Buddy',value: favoriteBuddy,icon: FiUsers,color: 'pink'},
    {label: 'Dive State of Mind',value: mostCommonExperience,icon: FiHeart,color: 'yellow'},
    {label: 'Goal Progress',value: `${goalProgress}%`,icon: FiTarget,color: 'emerald'}
  ];

  const quickActions=[
    {name: 'Log New Dive',path: '/dive-log',icon: FiActivity,color: 'ocean',description: 'Record your latest diving session'},
    {name: 'View Progress',path: '/analytics',icon: FiTrendingUp,color: 'coral',description: 'Analyze your performance trends'},
    {name: 'Browse Classes',path: '/classes',icon: FiActivity,color: 'green',description: 'Explore training programs'},
    {name: 'Find Instructors',path: '/directory',icon: FiUsers,color: 'purple',description: 'Connect with certified instructors'},
    {name: 'Plan Dive Trip',path: '/dive-planner',icon: FiCompass,color: 'blue',description: 'Organize your next adventure'},
    {name: 'Personal Diary',path: '/diary',icon: FiEdit3,color: 'pink',description: 'Document your journey'},
    {name: 'Breathwork Training',path: '/breathwork-trainer',icon: FiWind,color: 'indigo',description: 'Practice breathing exercises'},
    {name: 'Human Design',path: '/human-design',icon: FiHeart,color: 'yellow',description: 'Discover your learning style'}
  ];

  const recentActivity=[
    ...diveLog.slice(0,3).map(dive=> ({
      type: 'dive',
      title: `${dive.disciplineSubCategory} Training`,
      location: dive.location,
      depth: dive.depth ? `${dive.depth}m` : undefined,
      time: dive.time_duration,
      date: new Date(dive.date).toLocaleDateString()
    })),
    ...goals.slice(0,2).map(goal=> ({
      type: 'goal',
      title: goal.title,
      progress: `${Math.round((goal.currentValue / goal.targetValue) * 100)}%`,
      date: 'Ongoing'
    }))
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{opacity: 0,y: 20}}
          animate={{opacity: 1,y: 0}}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your Dashboard,{user?.name?.split(' ')[0]}! 🌊
          </h1>
          <p className="text-gray-600">
            Track your progress,plan your next dive,and connect with the community.
          </p>
        </motion.div>

        {/* Personal Stats Grid */}
        <motion.div
          initial={{opacity: 0,y: 20}}
          animate={{opacity: 1,y: 0}}
          transition={{delay: 0.1}}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalStats.map((stat,index)=> (
              <motion.div
                key={stat.label}
                initial={{opacity: 0,scale: 0.9}}
                animate={{opacity: 1,scale: 1}}
                transition={{delay: index * 0.05}}
                className="bg-white rounded-xl p-6 shadow-lg hover-lift dive-stats-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <SafeIcon icon={stat.icon} className={`text-2xl text-${stat.color}-500`} />
                  <span className={`text-2xl font-bold text-${stat.color}-600`}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Activity Feed */}
          <motion.div
            initial={{opacity: 0,x: -20}}
            animate={{opacity: 1,x: 0}}
            transition={{delay: 0.2}}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity,index)=> (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-ocean-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={activity.type==='dive' ? FiActivity : FiTarget} className="text-ocean-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {activity.location && `${activity.location} • `}
                      {activity.depth && `Depth: ${activity.depth} • `}
                      {activity.time && `Time: ${activity.time} • `}
                      {activity.progress && `Progress: ${activity.progress} • `}
                      {activity.date}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <SafeIcon icon={FiActivity} className="text-4xl mb-4 mx-auto" />
                  <p>No recent activity. Start by logging your first dive!</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Safety Spotlight */}
          <motion.div
            initial={{opacity: 0,x: 20}}
            animate={{opacity: 1,x: 0}}
            transition={{delay: 0.3}}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Safety Spotlight</h2>
            <div className="safety-highlight rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiShield} className="text-xl text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Daily Safety Tip</h3>
                  <p className="text-yellow-700 text-sm">
                    Always dive with a buddy and maintain constant visual contact. Never hold your breath on ascent to avoid shallow water blackout.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-800 text-sm">Emergency Contacts</h4>
                <p className="text-red-600 text-xs">Local Emergency: 112</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 text-sm">Safety Resources</h4>
                <p className="text-blue-600 text-xs">View safety protocols →</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Navigation Tiles */}
        <motion.div
          initial={{opacity: 0,y: 20}}
          animate={{opacity: 1,y: 0}}
          transition={{delay: 0.4}}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action,index)=> (
              <motion.div
                key={action.name}
                initial={{opacity: 0,scale: 0.9}}
                animate={{opacity: 1,scale: 1}}
                transition={{delay: 0.4 + index * 0.05}}
              >
                <Link
                  to={action.path}
                  className="block bg-white rounded-xl p-6 shadow-lg hover-lift text-center group"
                >
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-${action.color}-200 transition-colors`}>
                    <SafeIcon icon={action.icon} className={`text-2xl text-${action.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.name}</h3>
                  <p className="text-gray-600 text-xs">{action.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community Highlights */}
        <motion.div
          initial={{opacity: 0,y: 20}}
          animate={{opacity: 1,y: 0}}
          transition={{delay: 0.5}}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Featured Dive of the Day</h3>
            <img
              src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=200&fit=crop"
              alt="Featured dive"
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <p className="text-sm text-gray-600">Amazing -30m FIM dive by Sarah Johnson at Blue Hole</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="achievement-badge w-8 h-8 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiTarget} className="text-sm" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mike Chen</p>
                  <p className="text-xs text-gray-600">Reached 25m depth goal</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="achievement-badge w-8 h-8 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiActivity} className="text-sm" />
                </div>
                <div>
                  <p className="text-sm font-medium">Emma Wilson</p>
                  <p className="text-xs text-gray-600">100th dive logged!</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Instructor Spotlight</h3>
            <div className="flex items-center space-x-3 mb-3">
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
                alt="Instructor"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">Sarah Johnson</p>
                <p className="text-xs text-gray-600">AIDA Master Instructor</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Specializes in deep diving techniques and safety protocols.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;