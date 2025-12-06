import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { CheckCircle, XCircle, MessageCircle, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const AllComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllComments();
  }, []);

  const fetchAllComments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/comments');
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (commentId) => {
    try {
      await axiosInstance.put(`/comments/${commentId}/approve`, { approve: true });
      toast.success('Comment approved successfully');
      fetchAllComments(); // Refresh comments
    } catch (error) {
      console.error('Error approving comment:', error);
      toast.error('Failed to approve comment');
    }
  };

  const deleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This comment will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/comments/${commentId}`);
        toast.success('Comment deleted successfully');
        fetchAllComments(); // Refresh comments
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error(error.response?.data?.message || 'Failed to delete comment');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Comments</h1>
          <p className="text-gray-600 mt-2">Manage comments from all blog posts</p>
        </div>

        {/* Comments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
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
                {comments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No comments found.
                    </td>
                  </tr>
                ) : (
                  comments.map((comment) => (
                    <tr key={comment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {comment.message}
                          </p>
                          {comment.replies && comment.replies.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {comment.replies.length} repl{comment.replies.length === 1 ? 'y' : 'ies'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{comment.name}</p>
                          <p className="text-sm text-gray-500">{comment.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          comment.approved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {comment.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {!comment.approved && (
                            <button
                              onClick={() => approveComment(comment._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve Comment"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          <Link
                            to={`/blog/comments/${comment.blog}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Blog Comments"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() => deleteComment(comment._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        </div>
      </div>
    </div>
  );
};

export default AllComments;