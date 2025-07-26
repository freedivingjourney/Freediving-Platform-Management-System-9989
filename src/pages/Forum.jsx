import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageSquare, FiPlus, FiSearch, FiFilter, FiClock, FiTrendingUp, FiPin, FiLock, FiThumbsUp, FiMessageCircle, FiEye, FiUser, FiCalendar, FiTag, FiArrowUp, FiArrowDown, FiFlag, FiBookmark, FiShare2, FiEdit, FiTrash2, FiX, FiSave } = FiIcons;

const Forum = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [newReply, setNewReply] = useState('');

  const categories = [
    { id: 'all', name: 'All Topics', icon: FiMessageSquare, count: 156 },
    { id: 'techniques', name: 'Techniques & Training', icon: FiTrendingUp, count: 42 },
    { id: 'safety', name: 'Safety & Protocols', icon: FiLock, count: 28 },
    { id: 'equipment', name: 'Equipment & Gear', icon: FiUser, count: 31 },
    { id: 'locations', name: 'Dive Sites & Locations', icon: FiPin, count: 25 },
    { id: 'competitions', name: 'Competitions & Events', icon: FiTrendingUp, count: 18 },
    { id: 'beginners', name: 'Beginner Questions', icon: FiMessageCircle, count: 12 }
  ];

  const topics = [
    {
      id: 1,
      title: 'Best equalization techniques for deeper dives?',
      content: 'I\'m currently able to dive to 20m comfortably but struggling with equalization beyond that depth. What techniques have worked best for you when going deeper?',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        role: 'AIDA Instructor',
        posts: 142
      },
      category: 'techniques',
      tags: ['equalization', 'depth', 'training'],
      createdAt: '2024-05-20T10:30:00Z',
      updatedAt: '2024-05-20T15:45:00Z',
      views: 234,
      replies: 18,
      likes: 12,
      isPinned: true,
      isLocked: false,
      lastReply: {
        author: 'Mike Chen',
        time: '2 hours ago'
      }
    },
    {
      id: 2,
      title: 'Safety protocols for solo training sessions',
      content: 'What are the community\'s thoughts on solo training protocols? I understand the buddy system is ideal, but sometimes schedules don\'t align. What safety measures do you implement?',
      author: {
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        role: 'Advanced Student',
        posts: 67
      },
      category: 'safety',
      tags: ['safety', 'solo-training', 'protocols'],
      createdAt: '2024-05-19T14:20:00Z',
      updatedAt: '2024-05-20T09:15:00Z',
      views: 189,
      replies: 24,
      likes: 8,
      isPinned: false,
      isLocked: false,
      lastReply: {
        author: 'David Park',
        time: '5 hours ago'
      }
    },
    {
      id: 3,
      title: 'Recommended fins for dynamic disciplines',
      content: 'Looking to upgrade my fins specifically for dynamic apnea training. Current using basic recreational fins but want something more efficient. Budget around $200-300.',
      author: {
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        role: 'Member',
        posts: 23
      },
      category: 'equipment',
      tags: ['equipment', 'fins', 'dynamic', 'recommendations'],
      createdAt: '2024-05-19T09:45:00Z',
      updatedAt: '2024-05-19T16:30:00Z',
      views: 156,
      replies: 15,
      likes: 6,
      isPinned: false,
      isLocked: false,
      lastReply: {
        author: 'Sarah Johnson',
        time: '1 day ago'
      }
    },
    {
      id: 4,
      title: 'Blue Hole Cyprus - Recent conditions and tips',
      content: 'Just returned from a week of training at Blue Hole. Water temp was perfect at 24°C, visibility around 30m. Here are some tips for first-time visitors...',
      author: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'Competition Freediver',
        posts: 89
      },
      category: 'locations',
      tags: ['blue-hole', 'cyprus', 'conditions', 'travel'],
      createdAt: '2024-05-18T11:15:00Z',
      updatedAt: '2024-05-19T08:20:00Z',
      views: 312,
      replies: 31,
      likes: 22,
      isPinned: false,
      isLocked: false,
      lastReply: {
        author: 'Emma Wilson',
        time: '2 days ago'
      }
    }
  ];

  const replies = [
    {
      id: 1,
      topicId: 1,
      content: 'Great question! I found that the Frenzel technique works much better than Valsalva for deeper dives. The key is to practice the mouth movements on dry land first.',
      author: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        role: 'Competition Freediver'
      },
      createdAt: '2024-05-20T12:15:00Z',
      likes: 8,
      isLiked: false
    },
    {
      id: 2,
      topicId: 1,
      content: 'I agree with Mike. Also, make sure you\'re not forcing the equalization. If it doesn\'t work easily, ascend a bit and try again. Better safe than sorry!',
      author: {
        name: 'David Park',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
        role: 'Safety Instructor'
      },
      createdAt: '2024-05-20T13:30:00Z',
      likes: 5,
      isLiked: true
    }
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesCategory = activeCategory === 'all' || topic.category === activeCategory;
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedTopics = [...filteredTopics].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'mostReplies':
        return b.replies - a.replies;
      case 'mostViews':
        return b.views - a.views;
      case 'mostLikes':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const handleNewTopicSubmit = (e) => {
    e.preventDefault();
    // Add new topic logic here
    setShowNewTopic(false);
    setNewTopic({ title: '', content: '', category: '', tags: [] });
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '' && !newTopic.tags.includes(newTag.trim())) {
      setNewTopic(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index) => {
    setNewTopic(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    // Add reply logic here
    setNewReply('');
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (selectedTopic) {
    const topic = topics.find(t => t.id === selectedTopic);
    const topicReplies = replies.filter(r => r.topicId === selectedTopic);

    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setSelectedTopic(null)}
            className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 mb-6"
          >
            <SafeIcon icon={FiArrowUp} className="rotate-90" />
            <span>Back to Forum</span>
          </motion.button>

          {/* Topic Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {topic.isPinned && (
                    <SafeIcon icon={FiPin} className="text-orange-500" />
                  )}
                  {topic.isLocked && (
                    <SafeIcon icon={FiLock} className="text-red-500" />
                  )}
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {categories.find(c => c.id === topic.category)?.name}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{topic.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <img src={topic.author.avatar} alt={topic.author.name} className="w-6 h-6 rounded-full" />
                    <span>{topic.author.name}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(topic.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <SafeIcon icon={FiEye} />
                      <span>{topic.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <SafeIcon icon={FiMessageCircle} />
                      <span>{topic.replies}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <SafeIcon icon={FiThumbsUp} />
                      <span>{topic.likes}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <SafeIcon icon={FiBookmark} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <SafeIcon icon={FiShare2} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <SafeIcon icon={FiFlag} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="prose max-w-none mb-4">
              <p className="text-gray-700">{topic.content}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {topic.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
                  <SafeIcon icon={FiThumbsUp} />
                  <span>Like ({topic.likes})</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
                  <SafeIcon icon={FiArrowDown} />
                  <span>Reply</span>
                </button>
              </div>
              {user?.email === topic.author.email && (
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-ocean-600">
                    <SafeIcon icon={FiEdit} />
                  </button>
                  <button className="text-gray-500 hover:text-red-600">
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Replies */}
          <div className="space-y-4 mb-6">
            {topicReplies.map((reply, index) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start space-x-4">
                  <img src={reply.author.avatar} alt={reply.author.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-gray-900">{reply.author.name}</span>
                      <span className="text-sm text-gray-500">{reply.author.role}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{formatTimeAgo(reply.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{reply.content}</p>
                    <div className="flex items-center space-x-4">
                      <button className={`flex items-center space-x-1 ${reply.isLiked ? 'text-ocean-600' : 'text-gray-500'} hover:text-ocean-600`}>
                        <SafeIcon icon={FiThumbsUp} />
                        <span>{reply.likes}</span>
                      </button>
                      <button className="text-gray-500 hover:text-ocean-600">Reply</button>
                      <button className="text-gray-500 hover:text-red-600">
                        <SafeIcon icon={FiFlag} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reply Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a Reply</h3>
            <form onSubmit={handleReplySubmit}>
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                rows={4}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent mb-4"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 flex items-center space-x-2"
                >
                  <SafeIcon icon={FiSave} />
                  <span>Post Reply</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Forum</h1>
            <p className="text-gray-600">
              Ask questions, share knowledge, and connect with fellow freedivers
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewTopic(true)}
            className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} />
            <span>New Topic</span>
          </motion.button>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-ocean-100 text-ocean-800'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={category.icon} />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent appearance-none"
                  >
                    <option value="latest">Latest Activity</option>
                    <option value="oldest">Oldest First</option>
                    <option value="mostReplies">Most Replies</option>
                    <option value="mostViews">Most Views</option>
                    <option value="mostLikes">Most Likes</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Topics List */}
            <div className="space-y-4">
              {sortedTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedTopic(topic.id)}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <img src={topic.author.avatar} alt={topic.author.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {topic.isPinned && (
                          <SafeIcon icon={FiPin} className="text-orange-500" />
                        )}
                        {topic.isLocked && (
                          <SafeIcon icon={FiLock} className="text-red-500" />
                        )}
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {categories.find(c => c.id === topic.category)?.name}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {topic.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span key={tagIndex} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-ocean-600">
                        {topic.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{topic.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <SafeIcon icon={FiUser} />
                            <span>{topic.author.name}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <SafeIcon icon={FiClock} />
                            <span>{formatTimeAgo(topic.createdAt)}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <SafeIcon icon={FiEye} />
                            <span>{topic.views}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <SafeIcon icon={FiMessageCircle} />
                            <span>{topic.replies}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <SafeIcon icon={FiThumbsUp} />
                            <span>{topic.likes}</span>
                          </span>
                        </div>
                      </div>
                      {topic.lastReply && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Last reply by <span className="font-medium">{topic.lastReply.author}</span> {topic.lastReply.time}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* New Topic Modal */}
        <AnimatePresence>
          {showNewTopic && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowNewTopic(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Topic</h2>
                  <button
                    onClick={() => setShowNewTopic(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} className="text-xl text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleNewTopicSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic Title
                    </label>
                    <input
                      type="text"
                      value={newTopic.title}
                      onChange={(e) => setNewTopic(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="What would you like to discuss?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newTopic.category}
                      onChange={(e) => setNewTopic(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.filter(c => c.id !== 'all').map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={newTopic.content}
                      onChange={(e) => setNewTopic(prev => ({ ...prev, content: e.target.value }))}
                      rows={6}
                      placeholder="Describe your question or topic in detail..."
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
                        placeholder="Add tags..."
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
                    {newTopic.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newTopic.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium flex items-center space-x-1"
                          >
                            <span>#{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(index)}
                              className="text-gray-500 hover:text-red-500 ml-1"
                            >
                              <SafeIcon icon={FiX} className="text-xs" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowNewTopic(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <SafeIcon icon={FiSave} />
                      <span>Create Topic</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Forum;