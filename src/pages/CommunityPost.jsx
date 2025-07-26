import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useRole } from '../contexts/RoleContext';
import RoleBadge from '../components/RoleBadge';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiArrowLeft, FiUser, FiThumbsUp, FiMessageSquare, FiShare2, FiBookmark, FiFlag, FiPaperclip, FiEdit, FiTrash2, FiAlertTriangle, FiCheck, FiX
} = FiIcons;

// This page would normally fetch data based on the post ID
// For now we'll use static data
const CommunityPost = () => {
  const { postId } = useParams();
  const { user } = useAuth();
  const { hasPermission } = useRole();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [isAnonymousComment, setIsAnonymousComment] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  // Mock post data - would be fetched from API based on postId
  const post = {
    id: postId || '1',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      role: 'instructor',
      certifications: ['AIDA Instructor']
    },
    title: 'Tips for improving equalization at depth',
    content: `I have been working with students who struggle with equalization beyond 15m. Here are some techniques that have proven effective:

1. Start equalizing early and often - begin before you feel pressure

2. Use a gentle Frenzel technique rather than a forceful Valsalva

3. Practice dry equalization exercises daily

4. Ensure proper head position - too far back can close the eustachian tubes

5. Stay relaxed - tension makes equalization more difficult

I've found that many students focus too much on the depth they want to reach rather than the technique itself. When they shift their focus to proper technique and relaxation, depth comes naturally as a byproduct.

Has anyone else found effective methods for helping students overcome equalization barriers? I'd love to hear your experiences and approaches.`,
    category: 'Techniques',
    tags: ['Equalization', 'Depth', 'Training'],
    likes: 24,
    userLiked: false,
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
        likes: 5,
        userLiked: false
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
        likes: 3,
        userLiked: false
      },
      {
        id: 103,
        author: {
          name: 'David Park',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
          role: 'member'
        },
        content: 'Could you elaborate on the dry equalization exercises? I\'m not sure how to practice effectively at home.',
        timestamp: '3 days ago',
        likes: 2,
        userLiked: false
      }
    ],
    timestamp: '2 days ago',
    isPinned: true,
    isEdited: false,
    views: 128
  };

  // Handle new comment submission
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    // Add comment logic would go here
    console.log('New comment:', {
      content: newComment,
      anonymous: isAnonymousComment
    });

    // Reset form
    setNewComment('');
    setIsAnonymousComment(false);
  };

  // Handle comment editing
  const handleEditComment = (commentId) => {
    const comment = post.comments.find(c => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditedCommentText(comment.content);
    }
  };

  // Save edited comment
  const handleSaveEditedComment = (commentId) => {
    console.log('Saving edited comment:', {
      id: commentId,
      content: editedCommentText
    });
    setEditingComment(null);
    setEditedCommentText('');
  };

  // Handle comment deletion
  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      console.log('Deleting comment:', commentId);
      // Delete logic would go here
    }
  };

  // Handle post like
  const handleLikePost = () => {
    console.log('Liking post:', post.id);
    // Like post logic would go here
  };

  // Handle comment like
  const handleLikeComment = (commentId) => {
    console.log('Liking comment:', commentId);
    // Like comment logic would go here
  };

  // Handle report submission
  const handleSubmitReport = (e) => {
    e.preventDefault();
    console.log('Report submitted');
    setShowReportModal(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex items-center text-ocean-600 hover:text-ocean-700"
          onClick={() => navigate('/community')}
        >
          <SafeIcon icon={FiArrowLeft} className="mr-2" />
          <span>Back to Community</span>
        </motion.button>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          {post.isPinned && (
            <div className="inline-block bg-yellow-400 text-white text-xs px-2 py-1 rounded-lg font-medium mb-4">
              Pinned Post
            </div>
          )}

          <div className="flex items-start space-x-4 mb-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
              <div className="flex items-center space-x-2">
                <RoleBadge role={post.author.role} size="xs" />
                <p className="text-xs text-gray-500">{post.timestamp}</p>
                {post.isEdited && (
                  <span className="text-xs text-gray-500">(edited)</span>
                )}
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="prose max-w-none mb-6">
            {post.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
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
                className={`flex items-center space-x-1 ${
                  post.userLiked ? 'text-ocean-600' : 'text-gray-500 hover:text-ocean-600'
                }`}
                onClick={handleLikePost}
              >
                <SafeIcon icon={FiThumbsUp} />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500">
                <SafeIcon icon={FiMessageSquare} />
                <span>{post.comments.length}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
                <SafeIcon icon={FiShare2} />
              </button>
            </div>
            <div className="flex space-x-3">
              <button className="text-gray-400 hover:text-gray-600">
                <SafeIcon icon={FiBookmark} />
              </button>
              <button
                className="text-gray-400 hover:text-red-600"
                onClick={() => setShowReportModal(true)}
              >
                <SafeIcon icon={FiFlag} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
            <span>{post.views} views</span>
            {hasPermission('MODERATE_CONTENT') && (
              <div className="flex space-x-3">
                <button className="hover:text-ocean-600">Pin Post</button>
                <button className="hover:text-ocean-600">Edit</button>
                <button className="hover:text-red-600">Delete</button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="font-semibold text-gray-900 mb-6">Comments ({post.comments.length})</h2>

          {/* Add Comment */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex space-x-4">
              <img
                src={user?.avatar || "https://via.placeholder.com/40"}
                alt={user?.name}
                className="w-10 h-10 rounded-full"
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
                        checked={isAnonymousComment}
                        onChange={(e) => setIsAnonymousComment(e.target.checked)}
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

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex space-x-4">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  {editingComment === comment.id ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <textarea
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => setEditingComment(null)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEditedComment(comment.id)}
                          className="px-3 py-1 bg-ocean-600 text-white rounded-lg text-sm"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
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
                  )}

                  <div className="flex items-center space-x-4 mt-2 pl-4">
                    <button
                      className={`text-xs ${
                        comment.userLiked ? 'text-ocean-600' : 'text-gray-500 hover:text-ocean-600'
                      } flex items-center space-x-1`}
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <SafeIcon icon={FiThumbsUp} className="text-xs" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="text-xs text-gray-500 hover:text-ocean-600">Reply</button>
                    
                    {/* Edit/Delete if user is comment author or moderator */}
                    {(comment.author.name === user?.name || hasPermission('MODERATE_CONTENT')) && (
                      <>
                        <button
                          className="text-xs text-gray-500 hover:text-ocean-600"
                          onClick={() => handleEditComment(comment.id)}
                        >
                          <SafeIcon icon={FiEdit} className="text-xs mr-1" />
                          Edit
                        </button>
                        <button
                          className="text-xs text-gray-500 hover:text-red-600"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <SafeIcon icon={FiTrash2} className="text-xs mr-1" />
                          Delete
                        </button>
                      </>
                    )}
                    <button
                      className="text-xs text-gray-500 hover:text-red-600"
                      onClick={() => setShowReportModal(true)}
                    >
                      Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

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
    </div>
  );
};

export default CommunityPost;