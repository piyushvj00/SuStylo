import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Save, Calendar, User, Upload } from 'lucide-react';
import Tiptap from './Tiptap';

const BlogDetails = () => {
    const { id: blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        slug: '',
        author: '',
        meta_keywords: '',
        meta_description: '',
        image: null
    });

    useEffect(() => {
        fetchBlogDetails();
    }, [blogId]);

    const fetchBlogDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/blogs/${blogId}`);
            const blogData = response.data.blog;
            setBlog(blogData);
            setFormData({
                title: blogData.title || '',
                description: blogData.description || '',
                content: blogData.content || '',
                slug: blogData.slug || '',
                author: blogData.author || '',
                meta_keywords: blogData.meta?.keywords?.join(', ') || '',
                meta_description: blogData.meta?.description || '',
                image: null
            });
        } catch (error) {
            console.error('Error fetching blog details:', error);
            toast.error('Failed to load blog details');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({
            ...prev,
            content: content
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const submitData = new FormData();
            
            // Append all form data
            submitData.append('title', formData.title);
            submitData.append('slug', formData.slug);
            submitData.append('description', formData.description);
            submitData.append('content', formData.content);
            submitData.append('author', formData.author);
            
            if (formData.meta_keywords) {
                submitData.append('meta_keywords', formData.meta_keywords);
            }
            
            if (formData.meta_description) {
                submitData.append('meta_description', formData.meta_description);
            }
            
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            await axiosInstance.put(`/blogs/${blogId}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Blog updated successfully!');
            setEditing(false);
            fetchBlogDetails(); // Refresh data
        } catch (error) {
            console.error('Error updating blog:', error);
            toast.error(error.response?.data?.message || 'Failed to update blog');
        } finally {
            setSaving(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder-blog.jpg';
        return `http://localhost:5000/${imagePath}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
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
                    <p className="mt-4 text-gray-600">Loading blog details...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 text-lg">Blog not found.</p>
                    <Link
                        to="/blog"
                        className="inline-block mt-4 text-green-600 hover:text-green-700"
                    >
                        Back to Blogs
                    </Link>
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
                            <h1 className="text-3xl font-bold text-gray-900">
                                {editing ? 'Edit Blog' : 'Blog Details'}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {editing ? 'Update blog information' : 'View blog details and content'}
                            </p>
                        </div>
                    </div>

                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Blog
                        </button>
                    )}
                </div>

                {/* Blog Content */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {editing ? (
                        // Edit Form with Tiptap
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                {/* Author */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Author *
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                {/* Featured Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Featured Image
                                    </label>
                                    <div className="flex items-center gap-4">
                                        {blog.image && (
                                            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                                                <img
                                                    src={getImageUrl(blog.image)}
                                                    alt="Current featured"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Leave empty to keep current image
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content with Tiptap */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Content *
                                    </label>
                                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                                        <Tiptap
                                            content={formData.content}
                                            onChange={handleContentChange}
                                        />
                                    </div>
                                </div>

                                {/* Meta Keywords */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meta Keywords (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="meta_keywords"
                                        value={formData.meta_keywords}
                                        onChange={handleInputChange}
                                        placeholder="food, hotel, travel, blog"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {/* Meta Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meta Description
                                    </label>
                                    <textarea
                                        name="meta_description"
                                        value={formData.meta_description}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Brief meta description for SEO"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(false);
                                        // Reset form data to original blog data
                                        setFormData({
                                            title: blog.title || '',
                                            description: blog.description || '',
                                            content: blog.content || '',
                                            slug: blog.slug || '',
                                            author: blog.author || '',
                                            meta_keywords: blog.meta?.keywords?.join(', ') || '',
                                            meta_description: blog.meta?.description || '',
                                            image: null
                                        });
                                    }}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        // View Mode
                        <div>
                            {/* Featured Image */}
                            {blog.image && (
                                <div className="h-64 bg-gray-200 overflow-hidden">
                                    <img
                                        src={getImageUrl(blog.image)}
                                        alt={blog.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-blog.jpg';
                                        }}
                                    />
                                </div>
                            )}

                            <div className="p-6">
                                {/* Meta Information */}
                                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                                    <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span>{blog.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(blog.createdAt)}</span>
                                    </div>
                                    {blog.updatedAt !== blog.createdAt && (
                                        <div className="flex items-center gap-1">
                                            <span>Updated: {formatDate(blog.updatedAt)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Title and Description */}
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>
                                <p className="text-lg text-gray-600 mb-6">{blog.description}</p>

                                {/* Content */}
                                <div className="prose max-w-none">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: blog.content }}
                                        className="text-gray-700 leading-relaxed"
                                    />
                                </div>

                                {/* Meta Tags */}
                                {blog.meta && (
                                    <div className="mt-8 pt-6 border-t">
                                        <h3 className="font-semibold text-gray-900 mb-2">Meta Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            {blog.meta.keywords && blog.meta.keywords.length > 0 && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Keywords:</span>
                                                    <p className="text-gray-600 mt-1">{blog.meta.keywords.join(', ')}</p>
                                                </div>
                                            )}
                                            {blog.meta.description && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Meta Description:</span>
                                                    <p className="text-gray-600 mt-1">{blog.meta.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;