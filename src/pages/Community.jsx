import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useRole, PERMISSIONS } from '../contexts/RoleContext';
import RoleBadge from '../components/RoleBadge';
import ProtectedRoute from '../components/ProtectedRoute';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiMessageCircle, FiUsers, FiCalendar, FiHeart, FiSearch, FiFilter, FiPlus, FiThumbsUp, FiMessageSquare, FiShare2, FiBookmark, FiFlag, FiMapPin, FiClock, FiEdit, FiX, FiSave, FiPaperclip, FiTag, FiAlertTriangle, FiTrendingUp, FiLock, FiInfo, FiAward, FiCheckCircle, FiMaximize, FiMail, FiArrowRight, FiActivity, FiBook, FiCheck, FiUser, FiShield
} = FiIcons;

const Community = () => {
  const { user } = useAuth();
  const { hasPermission } = useRole();
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSortBy, setFilterSortBy] = useState('recent');

  // Modal states
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showPostDetailModal, setShowPostDetailModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);

  // New post form state
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    attachments: [],
    isAnonymous: false,
    isPinned: false,
    visibility: 'all'
  });

  // Comment state
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);

  // Mock data for discussions
  const discussions = [
    {
      id: 1,
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        role: 'instructor',
        certifications: ['AIDA Instructor']
      },
      title: 'Tips for improving equalization at depth',
      content: 'I have been working with students who struggle with equalization beyond 15m. Here are some techniques that have proven effective...\n\n1. Start equalizing early and often - begin before you feel pressure\n\n2. Use a gentle Frenzel technique rather than a forceful Valsalva\n\n3. Practice dry equalization exercises daily\n\n4. Ensure proper head position - too far back can close the eustachian tubes\n\n5. Stay relaxed - tension makes equalization more difficult',
      category: 'Techniques',
      tags: ['Equalization', 'Depth', 'Training'],
      likes: 24,
      comments: [
        {
          id: 101,
          author: {
            name: 'Mike Chen',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
            role: 'instructor'
          },
          content: 'Great tips! I\'d add that having students practice the "hands-free" equalization technique has shown amazing results for my students who struggle with deeper dives.',
          timestamp: '1 day ago',
          likes: 5
        },
        {
          id: 102,
          author: {
            name: 'Emma Wilson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
            role: 'student'
          },
          content: 'Thank you for these tips! I\'ve been stuck at 15m for months. Will try the daily dry exercises!',
          timestamp: '2 days ago',
          likes: 3
        }
      ],
      commentCount: 8,
      timestamp: '2 days ago',
      isPinned: true
    },
    {
      id: 2,
      author: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'instructor',
        certifications: ['Competition Coach']
      },
      title: 'Competition preparation mindset',
      content: 'With the upcoming AIDA competition, I wanted to share my mental preparation routine that helps me stay focused and calm...\n\nMental preparation is just as important as physical training for competition success. Here\'s my approach:\n\n1. Visualization: Spend 10 minutes daily visualizing successful dives\n\n2. Breathing practice: 15 minutes of relaxation breathing before sleep\n\n3. Positive affirmations: Create competition-specific affirmations\n\n4. Routine building: Establish a consistent pre-dive routine\n\n5. Controlled stress exposure: Simulate competition conditions during training',
      category: 'Competition',
      tags: ['Mental Training', 'Competition', 'Preparation'],
      likes: 31,
      comments: [
        {
          id: 103,
          author: {
            name: 'David Park',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
            role: 'member'
          },
          content: 'This is gold! I\'ve always struggled with competition nerves. Do you recommend any specific breathing patterns for the relaxation practice?',
          timestamp: '3 days ago',
          likes: 7
        }
      ],
      commentCount: 12,
      timestamp: '4 days ago'
    }
  ];

  // Mock data for members
  const members = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
      role: 'instructor',
      displayRole: 'AIDA Instructor',
      location: 'Cyprus',
      certifications: ['AIDA Master Instructor', 'PADI Freediver Instructor'],
      specialties: ['Deep Diving', 'Safety', 'Coaching'],
      availableForMentoring: true,
      bio: 'Passionate about teaching safe freediving techniques. Specializing in helping students overcome equalization issues and mental blocks.',
      experience: '12 years',
      personalBests: {
        depth: '60m',
        static: '6:30',
        dynamic: '120m'
      }
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      role: 'instructor',
      displayRole: 'Competition Coach',
      location: 'Philippines',
      certifications: ['AIDA Instructor', 'National Champion'],
      specialties: ['CWT', 'FIM', 'Competition'],
      availableForMentoring: true,
      bio: 'Former competitive freediver with 10+ years of coaching experience. Focused on mental preparation and competition strategies.',
      experience: '15 years',
      personalBests: {
        depth: '85m',
        static: '7:45',
        dynamic: '175m'
      }
    }
  ];

  // Mock data for upcoming events
  const events = [
    {
      id: 1,
      title: 'Weekly Pool Training',
      date: 'Every Tuesday',
      time: '7:00 PM - 9:00 PM',
      location: 'City Aquatic Center',
      attendees: 12,
      capacity: 15,
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=150&fit=crop'
    },
    {
      id: 2,
      title: 'Blue Hole Freediving Weekend',
      date: 'June 15-16, 2024',
      time: '8:00 AM - 5:00 PM',
      location: 'Blue Hole, Cyprus',
      attendees: 8,
      capacity: 10,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=150&fit=crop'
    }
  ];

  // Function to filter posts based on search and category
  const filteredDiscussions = discussions.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort posts based on selected sort option
  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (filterSortBy === 'recent') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else if (filterSortBy === 'popular') {
      return b.likes - a.likes;
    } else if (filterSortBy === 'comments') {
      return b.commentCount - a.commentCount;
    }
    return 0;
  });

  // Handle new post submission
  const handleSubmitPost = (e) => {
    e.preventDefault();
    console.log('New post submitted:', newPost);
    setShowNewPostModal(false);
    // Reset form
    setNewPost({
      title: '',
      content: '',
      category: '',
      tags: [],
      attachments: [],
      isAnonymous: false,
      isPinned: false,
      visibility: 'all'
    });
  };

  // Handle new comment submission
  const handleSubmitComment = (e) => {
    e.preventDefault();
    console.log('New comment submitted:', newComment);
    setNewComment('');
  };

  // Handle adding a tag to new post
  const handleAddTag = () => {
    if (newTag.trim() !== '' && !newPost.tags.includes(newTag.trim())) {
      setNewPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Handle removing a tag from new post
  const handleRemoveTag = (tagToRemove) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle post likes
  const handleLikePost = (postId) => {
    console.log('Liked post:', postId);
  };

  // Open post detail modal
  const openPostDetail = (post) => {
    setSelectedPost(post);
    setShowPostDetailModal(true);
  };

  // Handle mentor request
  const handleMentorRequest = (mentor) => {
    setSelectedMentor(mentor);
    setShowMentorModal(true);
  };

  // Handle report submission
  const handleSubmitReport = (e) => {
    e.preventDefault();
    console.log('Report submitted');
    setShowReportModal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discussions':
        return (
          <div className="space-y-6">
            {/* Categories Quick Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filterCategory === 'all' 
                    ? 'bg-ocean-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Topics
              </button>
              <button
                onClick={() => setFilterCategory('Techniques')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filterCategory === 'Techniques' 
                    ? 'bg-ocean-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Techniques
              </button>
              <button
                onClick={() => setFilterCategory('Safety')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filterCategory === 'Safety' 
                    ? 'bg-ocean-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Safety
              </button>
              <button
                onClick={() => setFilterCategory('Competition')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filterCategory === 'Competition' 
                    ? 'bg-ocean-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Competition
              </button>
            </div>

            {/* Sort Options */}
            <div className="flex justify-end mb-4">
              <select
                value={filterSortBy}
                onChange={(e) => setFilterSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="comments">Most Comments</option>
              </select>
            </div>

            {sortedDiscussions.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: post.id * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 relative cursor-pointer"
                onClick={() => openPostDetail(post)}
              >
                {post.isPinned && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg font-medium">
                    Pinned
                  </div>
                )}
                
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                    <div className="flex items-center space-x-2">
                      {post.author.role && (
                        <RoleBadge role={post.author.role} size="xs" />
                      )}
                      <p className="text-xs text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-ocean-100 text-ocean-800 px-2 py-1 rounded text-xs font-medium">
                    {post.category}
                  </span>
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-4">
                  <div className="flex space-x-6">
                    <button
                      className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikePost(post.id);
                      }}
                    >
                      <SafeIcon icon={FiThumbsUp} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
                      <SafeIcon icon={FiMessageSquare} />
                      <span>{post.commentCount}</span>
                    </button>
                    <button
                      className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SafeIcon icon={FiShare2} />
                    </button>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SafeIcon icon={FiBookmark} />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post);
                        setShowReportModal(true);
                      }}
                    >
                      <SafeIcon icon={FiFlag} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'members':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4">Member Directory</h3>
              <p className="text-gray-600 mb-4">
                Connect with verified freediving community members. All profiles have been verified by our administrators.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map(member => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: member.id * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{member.name}</h3>
                      <p className="text-ocean-600">{member.displayRole}</p>
                      <p className="text-sm text-gray-500">{member.location}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Experience
                      </h4>
                      <p className="text-sm text-gray-700">{member.experience}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Specialties
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {member.specialties.map(specialty => (
                          <span key={specialty} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                    <button className="flex-1 bg-ocean-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-ocean-700 transition-colors">
                      View Profile
                    </button>
                    <button className="flex-1 border border-ocean-600 text-ocean-600 py-2 rounded-lg text-sm font-medium hover:bg-ocean-50 transition-colors">
                      Message
                    </button>
                  </div>

                  {member.availableForMentoring && (
                    <div className="mt-3">
                      <button
                        onClick={() => handleMentorRequest(member)}
                        className="w-full bg-green-50 border border-green-200 text-green-700 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center space-x-2"
                      >
                        <SafeIcon icon={FiUsers} />
                        <span>Available for Mentoring</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            {events.map(event => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: event.id * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row"
              >
                <div className="md:w-1/3">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCalendar} className="text-ocean-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiClock} className="text-ocean-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiMapPin} className="text-ocean-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiUsers} className="text-ocean-500" />
                      <span>{event.attendees}/{event.capacity} Participants</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-ocean-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-ocean-700 transition-colors">
                      RSVP
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute requiredPermissions={[PERMISSIONS.ACCESS_COMMUNITY]}>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
              <p className="text-gray-600">
                Connect with fellow freedivers in our exclusive community
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewPostModal(true)}
              className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiPlus} />
              <span>New Post</span>
            </motion.button>
          </motion.div>

          {/* Tabs & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg mb-8"
          >
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('discussions')}
                  className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === 'discussions' 
                      ? 'border-b-2 border-ocean-600 text-ocean-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <SafeIcon icon={FiMessageCircle} />
                  <span>Discussions</span>
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === 'members' 
                      ? 'border-b-2 border-ocean-600 text-ocean-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <SafeIcon icon={FiUsers} />
                  <span>Members</span>
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === 'events' 
                      ? 'border-b-2 border-ocean-600 text-ocean-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <SafeIcon icon={FiCalendar} />
                  <span>Events</span>
                </button>
              </div>
            </div>
            <div className="p-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative flex-grow">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                />
              </div>
              {activeTab === 'discussions' && (
                <div className="flex space-x-3">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white"
                    onChange={(e) => setFilterCategory(e.target.value)}
                    value={filterCategory}
                  >
                    <option value="all">All Categories</option>
                    <option value="Techniques">Techniques</option>
                    <option value="Safety">Safety</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Locations">Locations</option>
                    <option value="Competition">Competition</option>
                    <option value="Mental Training">Mental Training</option>
                  </select>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <SafeIcon icon={FiFilter} className="text-gray-600" />
                  </button>
                </div>
              )}
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

          {/* Community Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gradient-to-r from-ocean-50 to-ocean-100 border border-ocean-200 rounded-xl p-6"
          >
            <div className="flex items-start space-x-4">
              <SafeIcon icon={FiHeart} className="text-2xl text-ocean-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-ocean-900 mb-2">Community Guidelines</h3>
                <p className="text-ocean-700">
                  Our community is built on respect, safety, and shared passion for freediving. Please keep discussions constructive, respect privacy, and prioritize safety in all advice. Remember that this is an exclusive space for verified members only.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewPostModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="text-xl text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmitPost} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Give your post a clear, descriptive title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Techniques">Techniques</option>
                  <option value="Safety">Safety</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Locations">Locations</option>
                  <option value="Competition">Competition</option>
                  <option value="Mental Training">Mental Training</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={6}
                  placeholder="Share your thoughts, questions, or insights in detail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tags to help others find your post"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-ocean-600 text-white px-4 py-2 rounded-lg hover:bg-ocean-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} />
                  </button>
                </div>
                {newPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium flex items-center"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-gray-500 hover:text-red-500"
                        >
                          <SafeIcon icon={FiX} className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymousPost"
                    checked={newPost.isAnonymous}
                    onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                    className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500 mr-2"
                  />
                  <label htmlFor="anonymousPost" className="text-sm text-gray-700">
                    Post anonymously
                  </label>
                </div>
                {hasPermission(PERMISSIONS.MODERATE_CONTENT) && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pinPost"
                      checked={newPost.isPinned}
                      onChange={(e) => setNewPost({ ...newPost, isPinned: e.target.checked })}
                      className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500 mr-2"
                    />
                    <label htmlFor="pinPost" className="text-sm text-gray-700">
                      Pin this post
                    </label>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {showPostDetailModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPostDetailModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Discussion Thread</h2>
              <button
                onClick={() => setShowPostDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="text-xl text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={selectedPost.author.avatar}
                    alt={selectedPost.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedPost.author.name}</h3>
                    <div className="flex items-center space-x-2">
                      {selectedPost.author.role && (
                        <RoleBadge role={selectedPost.author.role} size="xs" />
                      )}
                      <p className="text-xs text-gray-500">{selectedPost.timestamp}</p>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedPost.title}</h2>
                <div className="prose max-w-none mb-4">
                  {selectedPost.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-ocean-100 text-ocean-800 px-2 py-1 rounded text-xs font-medium">
                    {selectedPost.category}
                  </span>
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-4">
                  <div className="flex space-x-6">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
                      <SafeIcon icon={FiThumbsUp} />
                      <span>{selectedPost.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
                      <SafeIcon icon={FiMessageSquare} />
                      <span>{selectedPost.commentCount}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
                      <SafeIcon icon={FiShare2} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Comments</h3>
                <div className="space-y-6 mb-6">
                  {selectedPost.comments && selectedPost.comments.map(comment => (
                    <div key={comment.id} className="flex space-x-4">
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{comment.author.name}</span>
                              {comment.author.role && (
                                <RoleBadge role={comment.author.role} size="xs" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 pl-4">
                          <button className="text-xs text-gray-500 hover:text-ocean-600 flex items-center space-x-1">
                            <SafeIcon icon={FiThumbsUp} className="text-xs" />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="text-xs text-gray-500 hover:text-ocean-600">Reply</button>
                          <button className="text-xs text-gray-500 hover:text-red-600">Report</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <form onSubmit={handleSubmitComment} className="mt-6">
                  <div className="flex space-x-4">
                    <img
                      src={user?.avatar || "https://via.placeholder.com/40"}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add your comment..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        rows={3}
                        required
                      />
                      <div className="flex justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button type="button" className="p-2 text-gray-500 hover:text-ocean-600">
                            <SafeIcon icon={FiPaperclip} />
                          </button>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="anonymousComment"
                              className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500 mr-2"
                            />
                            <label htmlFor="anonymousComment" className="text-xs text-gray-700">
                              Comment anonymously
                            </label>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="bg-ocean-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ocean-700 transition-colors"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Report Content</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="text-xl text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmitReport} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for reporting
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="misinformation">Misinformation or safety concern</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="harassment">Harassment or bullying</option>
                  <option value="spam">Spam or commercial content</option>
                  <option value="other">Other reason</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional details
                </label>
                <textarea
                  rows={4}
                  placeholder="Please provide more information about your report..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <SafeIcon icon={FiAlertTriangle} className="text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Reports are confidential and will be reviewed by our moderation team promptly.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default Community;