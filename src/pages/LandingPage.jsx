import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiActivity, FiTarget, FiUsers, FiCalendar, FiCompass, FiHeart, FiEdit3, FiTrendingUp, FiShield, FiStar, FiCheck, FiArrowRight } = FiIcons;

const LandingPage = () => {
  const { isAuthenticated, isApproved } = useAuth();

  if (isAuthenticated && isApproved) {
    return <AuthenticatedHome />;
  }

  return <PublicLanding />;
};

const PublicLanding = () => {
  const features = [
    {
      icon: FiActivity,
      title: 'Comprehensive Dive Logging',
      description: 'Track every dive with detailed metrics, photos, and personal insights across all freediving disciplines.'
    },
    {
      icon: FiTarget,
      title: 'Goal Tracking & Analytics',
      description: 'Set personalized goals and visualize your progress with detailed analytics and performance insights.'
    },
    {
      icon: FiCompass,
      title: 'Advanced Dive Planning',
      description: 'Plan perfect dive trips with weather monitoring, equipment lists, and group coordination tools.'
    },
    {
      icon: FiHeart,
      title: 'Human Design Integration',
      description: 'Discover your unique learning style and receive personalized coaching based on your energetic design.'
    },
    {
      icon: FiUsers,
      title: 'Exclusive Community',
      description: 'Connect with verified freedivers, instructors, and enthusiasts in a safe, curated environment.'
    },
    {
      icon: FiEdit3,
      title: 'Personal Diary',
      description: 'Document your freediving journey with rich journaling tools and emotional tracking.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'AIDA Instructor',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
      quote: 'The Human Design integration has revolutionized how I coach my students. Each person gets truly personalized guidance.'
    },
    {
      name: 'Mike Chen',
      role: 'Competitive Freediver',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      quote: 'The analytics dashboard helped me identify patterns and break through my depth plateau. Incredible insights!'
    },
    {
      name: 'Emma Wilson',
      role: 'Recreational Freediver',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
      quote: 'Finally, a platform that understands the freediving community. The safety focus and exclusive access make all the difference.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-600 via-ocean-500 to-ocean-400"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920&h=1080&fit=crop"
            alt="Freediver underwater"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow">
              Start Your Freediving Journey
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-shadow">
              The complete platform for freedivers to log dives, track progress, plan trips, understand your learning style, set goals, note experiences, join events, and connect with the community
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-ocean-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Apply for Membership
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-ocean-600 transition-colors"
              >
                Learn More About Our Community
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Exclusive Access Notice */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-ocean-50 border-2 border-ocean-200 rounded-2xl p-8"
          >
            <SafeIcon icon={FiShield} className="text-4xl text-ocean-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-ocean-900 mb-4">Exclusive Access Community</h2>
            <p className="text-lg text-ocean-700 mb-6">
              This platform is available by invitation only to our students, friends, colleagues, and community members. All applications require manual approval to ensure a safe, trusted environment.
            </p>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-ocean-900 mb-3">Application Process:</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="text-green-500" />
                  <span>Submit detailed application</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="text-green-500" />
                  <span>Manual review by administrators</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="text-green-500" />
                  <span>Approval & community access</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Comprehensive Freediving Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to progress safely and effectively in your freediving journey, with personalized insights and community support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover-lift"
              >
                <div className="w-12 h-12 bg-ocean-100 rounded-lg flex items-center justify-center mb-4">
                  <SafeIcon icon={feature.icon} className="text-2xl text-ocean-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Personalized Learning */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Safety-First Approach with Personalized Learning
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform combines rigorous safety protocols with Human Design insights to provide truly personalized coaching and training approaches that honor your unique learning style.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <SafeIcon icon={FiShield} className="text-2xl text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Safety Protocols</h3>
                    <p className="text-gray-600">Comprehensive safety guidelines and emergency procedures integrated throughout the platform.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <SafeIcon icon={FiHeart} className="text-2xl text-coral-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Human Design Integration</h3>
                    <p className="text-gray-600">Personalized coaching strategies based on your unique energetic blueprint and learning style.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <SafeIcon icon={FiUsers} className="text-2xl text-ocean-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Community</h3>
                    <p className="text-gray-600">Connect with certified instructors and experienced freedivers in a trusted environment.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"
                alt="Freediving safety and training"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-ocean-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Trusted by the Community</h2>
            <p className="text-xl text-gray-600">
              See what our members say about their experience with FreediveHub
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <SafeIcon key={i} icon={FiStar} className="text-sm" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-ocean-600 to-ocean-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
            <p className="text-xl mb-8">
              Apply for exclusive access to the most comprehensive freediving platform available.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-ocean-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
            >
              <span>Apply for Membership</span>
              <SafeIcon icon={FiArrowRight} />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const AuthenticatedHome = () => {
  const { user } = useAuth();

  const quickStats = [
    { label: 'Total Dives', value: '47', icon: FiActivity, color: 'ocean' },
    { label: 'Current PB Depth', value: '-25m', icon: FiTrendingUp, color: 'coral' },
    { label: 'Days Since Last Dive', value: '3', icon: FiCalendar, color: 'green' },
    { label: 'Goal Progress', value: '73%', icon: FiTarget, color: 'purple' }
  ];

  const recentActivity = [
    {
      type: 'dive',
      title: 'FIM Training Session',
      location: 'Blue Hole, Cyprus',
      depth: '-22m',
      date: '2 days ago'
    },
    {
      type: 'goal',
      title: 'Depth Goal Achievement',
      description: 'Reached 25m milestone!',
      date: '1 week ago'
    },
    {
      type: 'event',
      title: 'Group Training Session',
      location: 'Local Pool',
      date: 'Tomorrow, 2:00 PM'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening in your freediving journey today.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover-lift"
            >
              <div className="flex items-center justify-between mb-4">
                <SafeIcon icon={stat.icon} className={`text-2xl text-${stat.color}-500`} />
                <span className={`text-3xl font-bold text-${stat.color}-600`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-ocean-100 rounded-lg flex items-center justify-center">
                    <SafeIcon 
                      icon={activity.type === 'dive' ? FiActivity : activity.type === 'goal' ? FiTarget : FiCalendar} 
                      className="text-ocean-600" 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {activity.location && `${activity.location} • `}
                      {activity.depth && `${activity.depth} • `}
                      {activity.description}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/dive-log"
                className="flex items-center space-x-3 p-3 bg-ocean-50 rounded-lg hover:bg-ocean-100 transition-colors"
              >
                <SafeIcon icon={FiActivity} className="text-ocean-600" />
                <span className="font-medium text-ocean-700">Log New Dive</span>
              </Link>
              
              <Link
                to="/goals"
                className="flex items-center space-x-3 p-3 bg-coral-50 rounded-lg hover:bg-coral-100 transition-colors"
              >
                <SafeIcon icon={FiTarget} className="text-coral-600" />
                <span className="font-medium text-coral-700">View Goals</span>
              </Link>
              
              <Link
                to="/dive-planner"
                className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <SafeIcon icon={FiCompass} className="text-green-600" />
                <span className="font-medium text-green-700">Plan Dive Trip</span>
              </Link>
              
              <Link
                to="/diary"
                className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <SafeIcon icon={FiEdit3} className="text-purple-600" />
                <span className="font-medium text-purple-700">Personal Diary</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Safety Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-6"
        >
          <div className="flex items-start space-x-4">
            <SafeIcon icon={FiShield} className="text-2xl text-yellow-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Daily Safety Tip</h3>
              <p className="text-yellow-700">
                Always perform proper warm-up breathing exercises before any freediving session. Start with relaxation breathing to prepare your mind and body for the dive ahead.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;