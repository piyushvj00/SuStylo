
import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, MessageCircle, User, Mail, Clock, Trash2, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';

const BlogComments = () => {
  const { blogId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [blogTitle, setBlogTitle] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  });

  // const fetchComments = async () => {
  //   try {
  //     setLoading(true);

  //     // Fetch blog details first
  //     try {
  //       const blogResponse = await axiosInstance.get(`/blogs/${blogId}`);
  //       if (blogResponse.data.success) {
  //         setBlogTitle(blogResponse.data.data.title);
  //       }
  //     } catch (blogError) {
  //       console.warn('Could not fetch blog title:', blogError);
  //     }

  //     // Try different endpoints for comments
  //     let allComments = [];

  //     // First try the specific status endpoints
  //     try {
  //       const response = await axiosInstance.get(`/blogs/${blogId}/comments`);
  //       if (response.data.success && Array.isArray(response.data.data)) {
  //         allComments = response.data.data;
  //       }
  //     } catch {
  //       console.log('Trying alternative endpoints...');

  //       // Try to fetch all comments from various statuses
  //       const endpoints = [
  //         `/blogs/approved/${blogId}`,
  //         `/blogs/pending/${blogId}`,
  //         `/blogs/rejected/${blogId}`
  //       ];

  //       const promises = endpoints.map(endpoint =>
  //         axiosInstance.get(endpoint).catch(() => ({ data: { success: false } }))
  //       );


  //       const results = await Promise.all(promises);

  //       results.forEach((result, index) => {
  //         if (result.data.success && Array.isArray(result.data.data)) {
  //           const status = endpoints[index].split('/')[2]; // approved, pending, or rejected
  //           const commentsWithStatus = result.data.data.map(comment => ({
  //             ...comment,
  //             status: status
  //           }));
  //           allComments = [...allComments, ...commentsWithStatus];
  //         }
  //       });
  //     }

  //     // Remove duplicates
  //     const uniqueComments = allComments.filter((comment, index, self) =>
  //       index === self.findIndex(c => c._id === comment._id)
  //     );

  //     // Calculate stats
  //     const total = uniqueComments.length;
  //     const approved = uniqueComments.filter(c => c.status === 'approved').length;
  //     const rejected = uniqueComments.filter(c => c.status === 'rejected').length;
  //     const pending = uniqueComments.filter(c => c.status === 'pending' || !c.status).length;

  //     setComments(uniqueComments);
  //     setStats({ total, approved, rejected, pending });

  //   } catch (error) {
  //     console.error('Error fetching comments:', error);
  //     toast.error('Failed to load comments');
  //     setComments([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchComments = useCallback(async () => {
  try {
    setLoading(true);

    // Fetch blog details first
    try {
      const blogResponse = await axiosInstance.get(`/blogs/${blogId}`);
      if (blogResponse.data.success) {
        setBlogTitle(blogResponse.data.data.title);
      }
    } catch (blogError) {
      console.warn('Could not fetch blog title:', blogError);
    }

    let allComments = [];

    try {
      const response = await axiosInstance.get(`/blogs/${blogId}/comments`);
      if (response.data.success && Array.isArray(response.data.data)) {
        allComments = response.data.data;
      }
    } catch {
      console.log('Trying alternative endpoints...');

      const endpoints = [
        `/blogs/approved/${blogId}`,
        `/blogs/pending/${blogId}`,
        `/blogs/rejected/${blogId}`
      ];

      const promises = endpoints.map(endpoint =>
        axiosInstance.get(endpoint).catch(() => ({ data: { success: false } }))
      );

      const results = await Promise.all(promises);

      results.forEach((result, index) => {
        if (result.data.success && Array.isArray(result.data.data)) {
          const status = endpoints[index].split('/')[2];
          const commentsWithStatus = result.data.data.map(comment => ({
            ...comment,
            status
          }));
          allComments = [...allComments, ...commentsWithStatus];
        }
      });
    }

    const uniqueComments = allComments.filter((comment, index, self) =>
      index === self.findIndex(c => c._id === comment._id)
    );

    const total = uniqueComments.length;
    const approved = uniqueComments.filter(c => c.status === 'approved').length;
    const rejected = uniqueComments.filter(c => c.status === 'rejected').length;
    const pending = uniqueComments.filter(c => c.status === 'pending' || !c.status).length;

    setComments(uniqueComments);
    setStats({ total, approved, rejected, pending });

  } catch (error) {
    console.error('Error fetching comments:', error);
    toast.error('Failed to load comments');
    setComments([]);
  } finally {
    setLoading(false);
  }
}, [blogId]);


useEffect(() => {
  fetchComments();
}, [fetchComments]);


  const approveComment = async (commentId) => {
    try {
      const response = await axiosInstance.put(`/blogs/comment/${commentId}/approve`);
      if (response.data.success) {
        toast.success('Comment approved successfully');
        fetchComments();
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
      const response = await axiosInstance.put(`/blogs/comment/${commentId}/reject`);
      if (response.data.success) {
        toast.success('Comment rejected successfully');
        fetchComments();
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
          fetchComments();
        } else {
          throw new Error('Failed to delete comment');
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error(error.response?.data?.message || 'Failed to delete comment');
      }
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
    } catch {
      return 'Invalid date';
    }

  };

  // Filter comments based on selected filter
  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true;
    if (filter === 'approved') return comment.status === 'approved';
    if (filter === 'pending') return comment.status === 'pending' || !comment.status;
    if (filter === 'rejected') return comment.status === 'rejected';
    return true;
  });

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
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

          <button
            onClick={fetchComments}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
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
                <CheckCircle className="h-6 w-6 text-green-600" />
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
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
          >
            All Comments ({stats.total})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'approved'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
          >
            Approved ({stats.approved})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'pending'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg transition-colors ${filter === 'rejected'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

        {/* Comments List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredComments.length === 0 ? (
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
              {filteredComments.map((comment) => (
                <div key={comment._id} className="p-6 hover:bg-gray-50 transition-colors">
                  {/* Comment Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {comment.user?.name || comment.name || 'Anonymous User'}
                          </span>
                        </div>

                        {comment.user?.email && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail className="h-3 w-3" />
                            <span>{comment.user.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${comment.status === 'approved'
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
                      {/* Approve Button */}
                      {comment.status !== 'approved' && (
                        <button
                          onClick={() => approveComment(comment._id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve Comment"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}

                      {/* Reject Button */}
                      {comment.status !== 'rejected' && (
                        <button
                          onClick={() => rejectComment(comment._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject Comment"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}

                      {/* Delete Button */}
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

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => approveComment(comment._id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve
                      </button>
                    )}

                    {comment.status !== 'rejected' && (
                      <button
                        onClick={() => rejectComment(comment._id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    )}

                    <button
                      onClick={() => deleteComment(comment._id, comment.text || comment.message)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <p>
            Showing {filteredComments.length} {filter !== 'all' ? filter : ''} comment{filteredComments.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Approved</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Pending</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Rejected</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogComments;