import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, MessageCircle, Send, Trash2, User as UserIcon, Mail, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import Swal from 'sweetalert2';

const BlogComments = () => {
  const { blogId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'approved', 'rejected', 'pending'
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  });

  // Fetch comments with proper dependency handling
  const fetchComments = React.useCallback(async () => {
    try {
      setLoading(true);
      let endpoint = `/blogs/${blogId}/comments`;
      
      // Try to fetch comments for the specific blog
      try {
        const response = await axiosInstance.get(endpoint);
        if (response.data.success) {
          const commentsData = response.data.data || [];
          setComments(commentsData);
          
          // Calculate stats
          const total = commentsData.length;
          const approved = commentsData.filter(c => c.status === 'approved').length;
          const rejected = commentsData.filter(c => c.status === 'rejected').length;
          const pending = commentsData.filter(c => !c.status || c.status === 'pending').length;
          
          setStats({ total, approved, rejected, pending });
        } else {
          throw new Error('Failed to fetch comments');
        }
      } catch (error) {
        console.warn('Could not fetch comments from specific endpoint, trying alternatives:', error);
        
        // Try approved endpoint
        if (filter === 'approved') {
          const approvedResponse = await axiosInstance.get(`/blogs/approved/${blogId}`);
          if (approvedResponse.data.success) {
            setComments(approvedResponse.data.data || []);
          }
        }
        // Try rejected endpoint
        else if (filter === 'rejected') {
          const rejectedResponse = await axiosInstance.get(`/blogs/rejected/${blogId}`);
          if (rejectedResponse.data.success) {
            setComments(rejectedResponse.data.data || []);
          }
        }
        // For 'all', we'll show an empty state or combine both
        else {
          // Try to get both approved and rejected and combine
          try {
            const [approvedRes, rejectedRes] = await Promise.all([
              axiosInstance.get(`/blogs/approved/${blogId}`),
              axiosInstance.get(`/blogs/rejected/${blogId}`)
            ]);
            
            const allComments = [
              ...(approvedRes.data.success ? approvedRes.data.data : []),
              ...(rejectedRes.data.success ? rejectedRes.data.data : [])
            ];
            
            setComments(allComments);
          } catch (combinedError) {
            console.error('Could not fetch any comments:', combinedError);
            setComments([]);
          }
        }
      }
      
      // Also fetch blog title for better UX
      try {
        const blogResponse = await axiosInstance.get(`/blogs/${blogId}`);
        if (blogResponse.data.success) {
          setBlogTitle(blogResponse.data.data.title);
        }
      } catch (blogError) {
        console.warn('Could not fetch blog title:', blogError);
      }
      
    } catch (error) {
      console.error('Error in fetchComments:', error);
      toast.error('Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [blogId, filter]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const approveComment = async (commentId) => {
    try {
      const response = await axiosInstance.put(`/blogs/comment/${commentId}/approve`, {
        status: 'approved'
      });
      
      if (response.data.success) {
        toast.success('Comment approved successfully');
        fetchComments(); // Refresh the list
      } else {
        throw new Error('Failed to approve comment');
      }
    } catch (error) {
      console.error('Error approving comment:', error);
      toast.error(error.response?.data?.message || 'Failed to approve comment');
    }
  };

  const rejectComment = async (commentId) => {
    try {
      const response = await axiosInstance.put(`/blogs/comment/${commentId}/reject`, {
        status: 'rejected'
      });
      
      if (response.data.success) {
        toast.success('Comment rejected successfully');
        fetchComments(); // Refresh the list
      } else {
        throw new Error('Failed to reject comment');
      }
    } catch (error) {
      console.error('Error rejecting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to reject comment');
    }
  };

  const deleteComment = async (commentId, commentText) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete comment: "${commentText.substring(0, 50)}..."?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(`/blogs/comment/${commentId}`);
        if (response.data.success) {
          toast.success('Comment deleted successfully');
          fetchComments(); // Refresh the list
        } else {
          throw new Error('Failed to delete comment');
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error(error.response?.data?.message || 'Failed to delete comment');
      }
    }
  };

  const submitReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      // Since we don't have a reply API yet, we'll simulate it
      toast.info('Reply feature coming soon!');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would call:
      // await axiosInstance.post(`/blogs/comment/${replyingTo}/reply`, {
      //   message: replyText,
      //   author: 'Admin' // or get from auth context
      // });
      
      toast.success('Reply functionality will be implemented soon!');
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply');
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleCommentAction = async (commentId, action) => {
    switch (action) {
      case 'approve':
        await approveComment(commentId);
        break;
      case 'reject':
        await rejectComment(commentId);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/blog"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Comments</h1>
              <p className="text-gray-600 mt-2">
                {blogTitle ? `Managing comments for: "${blogTitle}"` : 'Manage comments for this blog post'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Blog ID: {blogId}</p>
            <button
              onClick={fetchComments}
              className="mt-2 text-sm text-green-600 hover:text-green-700"
            >
              Refresh Comments
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Comments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <ThumbsUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-full">
                <ThumbsDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
          >
            All Comments ({stats.total})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'approved'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
          >
            Approved ({stats.approved})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'rejected'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

        {/* Comments List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No comments found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {filter === 'all' 
                  ? 'There are no comments for this blog post yet.' 
                  : `There are no ${filter} comments for this blog post.`
                }
              </p>
              <div className="mt-6">
                <Link
                  to={`/blog/${blogId}`}
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  View Blog Post
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {comments.map((comment) => (
                <div key={comment._id} className="p-6 hover:bg-gray-50 transition-colors">
                  {/* Comment Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="flex items-center gap-1 text-sm">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {comment.user?.name || comment.name || 'Anonymous User'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span>{comment.user?.email || comment.email || 'No email'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                        
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          comment.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : comment.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {comment.status ? comment.status.charAt(0).toUpperCase() + comment.status.slice(1) : 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {/* Quick Action Buttons */}
                      {comment.status !== 'approved' && (
                        <button
                          onClick={() => handleCommentAction(comment._id, 'approve')}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve Comment"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                      )}
                      
                      {comment.status !== 'rejected' && (
                        <button
                          onClick={() => handleCommentAction(comment._id, 'reject')}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject Comment"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Reply to Comment"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => deleteComment(comment._id, comment.text || comment.message)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete Comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Comment Body */}
                  <div className="mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                      {comment.text || comment.message || 'No comment text'}
                    </p>
                  </div>

                  {/* Detailed Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => handleCommentAction(comment._id, 'approve')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve
                      </button>
                    )}
                    
                    {comment.status !== 'rejected' && (
                      <button
                        onClick={() => handleCommentAction(comment._id, 'reject')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    )}
                    
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      {replyingTo === comment._id ? 'Cancel Reply' : 'Reply'}
                    </button>

                    <button
                      onClick={() => deleteComment(comment._id, comment.text || comment.message)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment._id && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-700">Admin Reply</span>
                      </div>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply as an admin..."
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                        rows="3"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={submitReply}
                          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Post Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Existing Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Replies ({comment.replies.length})</span>
                      </div>
                      {comment.replies.map((reply, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-gray-900 text-sm">{reply.author || 'Admin'}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <p>
            Showing {comments.length} {filter !== 'all' ? filter : ''} comment{comments.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 rounded-full border border-green-300"></div>
              <span>Approved</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 rounded-full border border-yellow-300"></div>
              <span>Pending</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 rounded-full border border-red-300"></div>
              <span>Rejected</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogComments;