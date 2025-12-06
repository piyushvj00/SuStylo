// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../../config/AxiosInstance';
// import { ToastContainer, toast } from 'react-toastify';
// import { useParams, Link } from 'react-router-dom';
// import { ArrowLeft, CheckCircle, XCircle, MessageCircle, Send, Trash2 } from 'lucide-react';
// import Swal from 'sweetalert2';

// const BlogComments = () => {
//   const { blogId } = useParams();
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [replyText, setReplyText] = useState('');

//   useEffect(() => {
//     fetchComments();
//   }, [blogId]);

//   const fetchComments = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/comments/blog/${blogId}`);
//       setComments(response.data.comments);
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//       toast.error('Failed to load comments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const approveComment = async (commentId) => {
//     try {
//       await axiosInstance.put(`/comments/${commentId}/approve`, { approve: true });
//       toast.success('Comment approved successfully');
//       fetchComments(); // Refresh comments
//     } catch (error) {
//       console.error('Error approving comment:', error);
//       toast.error('Failed to approve comment');
//     }
//   };

//   const deleteComment = async (commentId) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'This comment will be permanently deleted!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, delete it!'
//     });

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/comments/${commentId}`);
//         toast.success('Comment deleted successfully');
//         fetchComments(); // Refresh comments
//       } catch (error) {
//         console.error('Error deleting comment:', error);
//         toast.error(error.response?.data?.message || 'Failed to delete comment');
//       }
//     }
//   };

//   const submitReply = async (commentId) => {
//     if (!replyText.trim()) {
//       toast.error('Please enter a reply message');
//       return;
//     }

//     try {
//       await axiosInstance.post(`/comments/${commentId}/reply`, {
//         message: replyText
//       });
//       toast.success('Reply added successfully');
//       setReplyingTo(null);
//       setReplyText('');
//       fetchComments(); // Refresh comments
//     } catch (error) {
//       console.error('Error adding reply:', error);
//       toast.error('Failed to add reply');
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading comments...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <ToastContainer />
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <Link
//             to="/blogs"
//             className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </Link>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Blog Comments</h1>
//             <p className="text-gray-600 mt-2">Manage comments for this blog post</p>
//           </div>
//         </div>

//         {/* Comments List */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           {comments.length === 0 ? (
//             <div className="text-center py-12">
//               <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500">No comments yet for this blog post.</p>
//             </div>
//           ) : (
//             comments.map((comment) => (
//               <div key={comment._id} className="border-b last:border-b-0">
//                 {/* Main Comment */}
//                 <div className="p-6">
//                   <div className="flex justify-between items-start mb-3">
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{comment.name}</h3>
//                       <p className="text-sm text-gray-500">{comment.email}</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className={`text-xs px-2 py-1 rounded-full ${
//                         comment.approved 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {comment.approved ? 'Approved' : 'Pending'}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         {formatDate(comment.createdAt)}
//                       </span>
//                     </div>
//                   </div>

//                   <p className="text-gray-700 mb-4">{comment.message}</p>

//                   {/* Action Buttons */}
//                   <div className="flex items-center gap-2">
//                     {!comment.approved && (
//                       <button
//                         onClick={() => approveComment(comment._id)}
//                         className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
//                       >
//                         <CheckCircle className="h-4 w-4" />
//                         Approve
//                       </button>
//                     )}
                    
//                     <button
//                       onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
//                       className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
//                     >
//                       <MessageCircle className="h-4 w-4" />
//                       Reply
//                     </button>

//                     <button
//                       onClick={() => deleteComment(comment._id)}
//                       className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                       Delete
//                     </button>
//                   </div>

//                   {/* Reply Form */}
//                   {replyingTo === comment._id && (
//                     <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//                       <textarea
//                         value={replyText}
//                         onChange={(e) => setReplyText(e.target.value)}
//                         placeholder="Type your reply here..."
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
//                         rows="3"
//                       />
//                       <div className="flex justify-end gap-2">
//                         <button
//                           onClick={() => {
//                             setReplyingTo(null);
//                             setReplyText('');
//                           }}
//                           className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           onClick={() => submitReply(comment._id)}
//                           className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                         >
//                           <Send className="h-4 w-4" />
//                           Send Reply
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {/* Existing Replies */}
//                   {comment.replies && comment.replies.length > 0 && (
//                     <div className="mt-4 ml-6">
//                       <h4 className="font-medium text-gray-700 mb-2">Replies:</h4>
//                       {comment.replies.map((reply, ) => (
//                         <div key={reply._id} className="bg-gray-50 p-3 rounded-lg mb-2">
//                           <div className="flex justify-between items-start mb-1">
//                             <span className="font-medium text-gray-900">{reply.author}</span>
//                             <span className="text-xs text-gray-500">
//                               {formatDate(reply.createdAt)}
//                             </span>
//                           </div>
//                           <p className="text-gray-700">{reply.message}</p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogComments;



import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, MessageCircle, Send, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const BlogComments = () => {
  const { blogId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      // Remove approved filter to get all comments
      const response = await axiosInstance.get(`/comments/blog/${blogId}?approved=all`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (commentId, approve = true) => {
    try {
      await axiosInstance.put(`/comments/${commentId}/approve`, { approve });
      toast.success(`Comment ${approve ? 'approved' : 'unapproved'} successfully`);
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
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
        fetchComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error(error.response?.data?.message || 'Failed to delete comment');
      }
    }
  };

  const submitReply = async (commentId) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      await axiosInstance.post(`/comments/${commentId}/reply`, {
        message: replyText
      });
      toast.success('Reply added successfully');
      setReplyingTo(null);
      setReplyText('');
      fetchComments();
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply');
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/blog"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Comments</h1>
            <p className="text-gray-600 mt-2">Manage comments for this blog post</p>
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No comments found for this blog post.</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="border-b last:border-b-0">
                {/* Main Comment */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{comment.name}</h3>
                      <p className="text-sm text-gray-500">{comment.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        comment.approved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {comment.approved ? 'Approved' : 'Pending'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{comment.message}</p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {comment.approved ? (
                      <button
                        onClick={() => approveComment(comment._id, false)}
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                      >
                        <XCircle className="h-4 w-4" />
                        Unapprove
                      </button>
                    ) : (
                      <button
                        onClick={() => approveComment(comment._id, true)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                    )}
                    
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Reply
                    </button>

                    <button
                      onClick={() => deleteComment(comment._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment._id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                        rows="3"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => submitReply(comment._id)}
                          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Send className="h-4 w-4" />
                          Send Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Existing Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-6">
                      <h4 className="font-medium text-gray-700 mb-2">Replies:</h4>
                      {comment.replies.map((reply, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-gray-900">{reply.author}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogComments;