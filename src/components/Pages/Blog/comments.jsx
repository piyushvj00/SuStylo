import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { CheckCircle, XCircle, Trash2, Eye, MessageCircle, Filter, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const AllComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'approved', 'rejected', 'pending'
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  });

  // Fetch all comments with memoization to prevent infinite loops
  const fetchAllComments = React.useCallback(async () => {
    try {
      setLoading(true);
      
      // First, get all blogs
      const blogsResponse = await axiosInstance.get('/blogs/list');
      if (!blogsResponse.data.success) {
        throw new Error('Failed to fetch blogs');
      }
      
      const blogs = blogsResponse.data.data || [];
      const allComments = [];
      
      // Fetch comments for each blog
      for (const blog of blogs) {
        try {
          // Try to get all comments for this blog
          const commentResponse = await axiosInstance.get(`/blogs/${blog._id}/comments`);
          if (commentResponse.data.success && commentResponse.data.data) {
            const blogComments = commentResponse.data.data.map(comment => ({
              ...comment,
              blogTitle: blog.title,
              blogSlug: blog.slug,
              blogId: blog._id
            }));
            allComments.push(...blogComments);
          }
        } catch (blogError) {
          console.warn(`Could not fetch comments for blog ${blog._id}:`, blogError);
          
          // Try alternative endpoints for this blog
          try {
            // Try approved comments
            const approvedResponse = await axiosInstance.get(`/blogs/approved/${blog._id}`);
            if (approvedResponse.data.success && approvedResponse.data.data) {
              const approvedComments = approvedResponse.data.data.map(comment => ({
                ...comment,
                status: 'approved',
                blogTitle: blog.title,
                blogSlug: blog.slug,
                blogId: blog._id
              }));
              allComments.push(...approvedComments);
            }
          } catch (approvedError) {
            console.warn(`Could not fetch approved comments for blog ${blog._id}:`, approvedError);
          }
          
          try {
            // Try rejected comments
            const rejectedResponse = await axiosInstance.get(`/blogs/rejected/${blog._id}`);
            if (rejectedResponse.data.success && rejectedResponse.data.data) {
              const rejectedComments = rejectedResponse.data.data.map(comment => ({
                ...comment,
                status: 'rejected',
                blogTitle: blog.title,
                blogSlug: blog.slug,
                blogId: blog._id
              }));
              allComments.push(...rejectedComments);
            }
          } catch (rejectedError) {
            console.warn(`Could not fetch rejected comments for blog ${blog._id}:`, rejectedError);
          }
        }
      }
      
      // Calculate statistics
      const total = allComments.length;
      const approved = allComments.filter(c => c.status === 'approved').length;
      const rejected = allComments.filter(c => c.status === 'rejected').length;
      const pending = allComments.filter(c => !c.status || c.status === 'pending').length;
      
      setStats({ total, approved, rejected, pending });
      setComments(allComments);
      
    } catch (error) {
      console.error('Error fetching all comments:', error);
      toast.error('Failed to load comments');
      setComments([]);
      setStats({ total: 0, approved: 0, rejected: 0, pending: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllComments();
  }, [fetchAllComments]);

  const approveComment = async (commentId) => {
    try {
      const response = await axiosInstance.put(`/blogs/comment/${commentId}/approve`, {
        status: 'approved'
      });
      
      if (response.data.success) {
        toast.success('Comment approved successfully');
        fetchAllComments(); // Refresh comments
      } else {
        throw new Error('Failed to approve comment');
      }
    } catch (error) {
      console.error('Error approving comment:', error);
      toast.error('Failed to approve comment');
    }
  };

  const rejectComment = async (commentId) => {
    try {
      const response = await axiosInstance.put(`/blogs/comment/${commentId}/reject`, {
        status: 'rejected'
      });
      
      if (response.data.success) {
        toast.success('Comment rejected successfully');
        fetchAllComments(); // Refresh comments
      } else {
        throw new Error('Failed to reject comment');
      }
    } catch (error) {
      console.error('Error rejecting comment:', error);
      toast.error('Failed to reject comment');
    }
  };

  const deleteComment = async (commentId, commentText = '') => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: commentText 
        ? `Delete comment: "${commentText.substring(0, 50)}${commentText.length > 50 ? '...' : ''}"?`
        : 'This comment will be permanently deleted!',
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
          fetchAllComments(); // Refresh comments
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
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Filter and search comments
  const filteredComments = comments.filter(comment => {
    // Apply status filter
    if (filter === 'approved' && comment.status !== 'approved') return false;
    if (filter === 'rejected' && comment.status !== 'rejected') return false;
    if (filter === 'pending' && (comment.status && comment.status !== 'pending')) return false;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesText = (comment.text || comment.message || '').toLowerCase().includes(searchLower);
      const matchesAuthor = (comment.user?.name || comment.name || '').toLowerCase().includes(searchLower);
      const matchesEmail = (comment.user?.email || comment.email || '').toLowerCase().includes(searchLower);
      const matchesBlog = (comment.blogTitle || '').toLowerCase().includes(searchLower);
      
      return matchesText || matchesAuthor || matchesEmail || matchesBlog;
    }
    
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Comments</h1>
              <p className="text-gray-600 mt-2">Manage comments from all blog posts</p>
            </div>
            <button
              onClick={fetchAllComments}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                <Filter className="h-6 w-6 text-yellow-600" />
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

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'approved'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'pending'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'rejected'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search comments, authors, or blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment & Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blog
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No comments found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          {searchTerm
                            ? `No comments match "${searchTerm}"`
                            : filter !== 'all'
                            ? `No ${filter} comments found`
                            : 'No comments have been posted yet.'
                          }
                        </p>
                        {(searchTerm || filter !== 'all') && (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setFilter('all');
                            }}
                            className="mt-4 text-sm text-green-600 hover:text-green-700"
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredComments.map((comment) => (
                    <tr key={comment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                              {comment.text || comment.message || 'No comment text'}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="font-medium">{comment.user?.name || comment.name || 'Anonymous'}</span>
                              <span>•</span>
                              <span>{comment.user?.email || comment.email || 'No email'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {comment.blogTitle || 'Unknown Blog'}
                          </p>
                          {comment.blogSlug && (
                            <p className="text-xs text-gray-500 truncate max-w-xs">{comment.blogSlug}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          comment.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : comment.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {comment.status ? comment.status.charAt(0).toUpperCase() + comment.status.slice(1) : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {comment.status !== 'approved' && (
                            <button
                              onClick={() => approveComment(comment._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve Comment"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          {comment.status !== 'rejected' && (
                            <button
                              onClick={() => rejectComment(comment._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject Comment"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          {comment.blogId && (
                            <Link
                              to={`/blog/comments/${comment.blogId}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Blog Comments"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          )}

                          <button
                            onClick={() => deleteComment(comment._id, comment.text || comment.message)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Delete Comment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Summary Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="text-sm text-gray-600">
              Showing {filteredComments.length} of {comments.length} comments
              {searchTerm && ` matching "${searchTerm}"`}
              {filter !== 'all' && ` (${filter})`}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Approved</span>
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Pending</span>
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Rejected</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllComments;