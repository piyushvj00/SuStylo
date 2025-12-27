// import React, { useState, useEffect } from 'react';
// import axiosInstance from '../../../config/AxiosInstance';
// import { ToastContainer, toast } from 'react-toastify';
// import { Edit, Trash2, Eye, MessageCircle, Plus, Calendar, User } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import Swal from 'sweetalert2';

// const BlogsList = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 9; // Keep it but add a comment about its purpose

//   useEffect(() => {
//     fetchBlogs();
//   }, [currentPage]);

//   const fetchBlogs = async () => {
//     try {
//       setLoading(true);
//       // We'll use the limit in future pagination implementation
//       // For now, we're keeping it as it might be used later
//       const response = await axiosInstance.get('/blogs/list');
//       if (response.data.success) {
//         setBlogs(response.data.data);
//         setTotalPages(response.data.pagination?.totalPages || 1);
//       } else {
//         throw new Error('Failed to fetch blogs');
//       }
//     } catch (error) {
//       console.error('Error fetching blogs:', error);
//       toast.error('Failed to load blogs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteBlog = async (blogId, blogTitle) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: `Do you want to delete "${blogTitle}"?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, delete it!'
//     });

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/blogs/delete/${blogId}`);
//         toast.success('Blog deleted successfully');
//         fetchBlogs(); // Refresh the list
//       } catch (error) {
//         console.error('Error deleting blog:', error);
//         toast.error(error.response?.data?.message || 'Failed to delete blog');
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return '';
//     if (imagePath.startsWith('http')) return imagePath;

//     // Check if the image exists by trying multiple paths
//     // const baseUrl = 'http://localhost:5000';
//     const baseUrl = 'https://api.sustylo.com';
//     const possiblePaths = [
//       `${baseUrl}/${imagePath}`,
//       `${baseUrl}/uploads/${imagePath}`,
//       `${baseUrl}/images/${imagePath}`,
//       `${baseUrl}/public/${imagePath}`
//     ];

//     return possiblePaths[0]; // Return the first path
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading blogs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <ToastContainer />
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
//             <p className="text-gray-600 mt-2">Manage your blog posts</p>
//           </div>
//           <Link
//             to="/blog/create"
//             className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
//           >
//             <Plus className="h-5 w-5" />
//             Create New Blog
//           </Link>
//         </div>

//         {/* Blogs Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {blogs.map((blog) => (
//             <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//               {/* Blog Image */}
//               <div className="h-48 bg-gray-200 overflow-hidden relative">
//                 {blog.coverImage || blog.images?.[0] ? (
//                   <img
//                     src={getImageUrl(blog.coverImage || blog.images[0])}
//                     alt={blog.title}
//                     className="w-full h-full object-cover"
//                     loading="lazy"
//                     onError={(e) => {
//                       // Hide broken image and show fallback
//                       e.target.style.display = 'none';
//                       const fallback = document.createElement('div');
//                       fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200';
//                       fallback.innerHTML = `
//                         <div class="text-center">
//                           <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//                           </svg>
//                           <p class="text-gray-500 text-sm">No image available</p>
//                         </div>
//                       `;
//                       e.target.parentElement.appendChild(fallback);
//                     }}
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
//                     <div className="text-center">
//                       <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//                       </svg>
//                       <p className="text-gray-500 text-sm">No image available</p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Blog Content */}
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
//                   {blog.title}
//                 </h3>
//                 <p className="text-gray-600 text-sm mb-4 line-clamp-3">
//                   {blog.metaDescription || blog.contentHtml?.replace(/<[^>]*>/g, '').substring(0, 100) || 'No description available'}
//                 </p>

//                 {/* Meta Information */}
//                 <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                   <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-1">
//                       <User className="h-4 w-4" />
//                       <span>{blog.author?.name || 'Admin'}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Calendar className="h-4 w-4" />
//                       <span>{formatDate(blog.createdAt)}</span>
//                     </div>
//                   </div>
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     blog.isPublished 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {blog.isPublished ? 'Published' : 'Draft'}
//                   </span>
//                 </div>

//                 {/* Tags */}
//                 {blog.tags && blog.tags.length > 0 && (
//                   <div className="flex flex-wrap gap-1 mb-4">
//                     {blog.tags.slice(0, 3).map((tag, index) => (
//                       <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
//                         {tag}
//                       </span>
//                     ))}
//                     {blog.tags.length > 3 && (
//                       <span className="px-2 py-1 text-gray-500 text-xs">
//                         +{blog.tags.length - 3} more
//                       </span>
//                     )}
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex items-center justify-between border-t pt-4">
//                   <div className="flex items-center gap-2">
//                     <Link
//                       to={`/blog/${blog._id}`}
//                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                       title="View Details"
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Link>

//                     <Link
//                       to={`/blog/edit/${blog._id}`}
//                       className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                       title="Edit Blog"
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Link>

//                     <Link
//                       to={`/blog/comments/${blog._id}`}
//                       className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
//                       title="View Comments"
//                     >
//                       <MessageCircle className="h-4 w-4" />
//                     </Link>
//                   </div>

//                   <button
//                     onClick={() => deleteBlog(blog._id, blog.title)}
//                     className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                     title="Delete Blog"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Pagination - Using limit for calculations */}
//         {totalPages > 1 && (
//           <div className="flex justify-center mt-8">
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//                 className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>

//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 let pageNum;
//                 if (totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   pageNum = totalPages - 4 + i;
//                 } else {
//                   pageNum = currentPage - 2 + i;
//                 }

//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => setCurrentPage(pageNum)}
//                     className={`px-4 py-2 rounded-lg ${
//                       currentPage === pageNum
//                         ? 'bg-green-600 text-white'
//                         : 'bg-white text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}

//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                 disabled={currentPage === totalPages}
//                 className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="text-center mt-2 text-sm text-gray-500">
//               Page {currentPage} of {totalPages} (showing up to {limit} items per page)
//             </div>
//           </div>
//         )}

//         {blogs.length === 0 && (
//           <div className="text-center py-12">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
//               </svg>
//             </div>
//             <p className="text-gray-500 text-lg">No blogs found.</p>
//             <Link
//               to="/blog/create"
//               className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors mt-4"
//             >
//               <Plus className="h-5 w-5" />
//               Create Your First Blog
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BlogsList;




import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { Edit, Trash2, Eye, MessageCircle, Plus, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 9;

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/blogs/list?page=${currentPage}&limit=${limit}`);
      if (response.data.success) {
        setBlogs(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } else {
        throw new Error('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (blogId, blogTitle) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${blogTitle}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/blogs/delete/${blogId}`);
        toast.success('Blog deleted successfully');
        fetchBlogs(); // Refresh the list
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error(error.response?.data?.message || 'Failed to delete blog');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;

    // For Cloudinary URLs or local uploads
    const baseUrl = process.env.REACT_APP_API_URL || 'https://api.sustylo.com';

    // If it's a relative path, prepend base URL
    if (imagePath.startsWith('/')) {
      return `${baseUrl}${imagePath}`;
    }

    // For Cloudinary URLs, return as is (they already have full URL)
    if (imagePath.includes('cloudinary.com')) {
      return imagePath;
    }

    // Default fallback
    return `${baseUrl}/uploads/${imagePath}`;
  };

  const extractTextFromHTML = (html) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
            <p className="text-gray-600 mt-2">Manage your blog posts</p>
          </div>
          <Link
            to="/blog/create"
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create New Blog
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Blogs</p>
            <p className="text-2xl font-bold">{totalItems}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Published</p>
            <p className="text-2xl font-bold">{blogs.filter(b => b.isPublished).length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Drafts</p>
            <p className="text-2xl font-bold">{blogs.filter(b => !b.isPublished).length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">This Page</p>
            <p className="text-2xl font-bold">{blogs.length}</p>
          </div>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Blog Image */}
              <div className="h-48 bg-gray-200 overflow-hidden relative">
                {blog.coverImage ? (
                  <img
                    src={getImageUrl(blog.coverImage)}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200';
                      fallback.innerHTML = `
                        <div class="text-center">
                          <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p class="text-gray-500 text-sm">No image available</p>
                        </div>
                      `;
                      e.target.parentElement.appendChild(fallback);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p className="text-gray-500 text-sm">No image available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {blog.metaDescription || extractTextFromHTML(blog.contentHtml).substring(0, 100) + '...' || 'No description available'}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{blog.author?.name || 'Admin'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${blog.isPublished
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">
                        +{blog.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <span>Views: {blog.views || 0}</span>
                    <span>Comments: {blog.comments?.length || 0}</span>
                  </div>
                  <span>{blog.category || 'Uncategorized'}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/blog/${blog._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    {/* <Link
                      to={`/blog/edit/${blog._id}`}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Blog"
                    >
                      <Edit className="h-4 w-4" />
                    </Link> */}


                    <Link
                      to={`/blog/comments/${blog._id}`}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View Comments"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Link>
                  </div>

                  <button
                    onClick={() => deleteBlog(blog._id, blog.title)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Blog"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg ${currentPage === pageNum
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border"
                >
                  Next
                </button>
              </div>
              <div className="text-center text-sm text-gray-500">
                Page {currentPage} of {totalPages} • Showing {blogs.length} of {totalItems} blogs
              </div>
            </div>
          </div>
        )}

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No blogs found.</p>
            <Link
              to="/blog/create"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors mt-4"
            >
              <Plus className="h-5 w-5" />
              Create Your First Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsList;