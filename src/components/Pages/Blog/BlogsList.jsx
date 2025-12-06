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
  const limit = 9;

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/blogs', {
        params: { page: currentPage, limit }
      });
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
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
        await axiosInstance.delete(`/blogs/${blogId}`);
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
    if (!imagePath) return '/placeholder-blog.jpg';
    return `http://localhost:5000/${imagePath}`;
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

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Blog Image */}
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={getImageUrl(blog.image)}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-blog.jpg';
                  }}
                />
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {blog.description}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{blog.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>
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

                    {/* <Link
                      to={`/blog/comments/${blog._id}`}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View Comments"
                    >
                      <MessageCircle className="h-4 w-4" />
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
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}

        {blogs.length === 0 && (
          <div className="text-center py-12">
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