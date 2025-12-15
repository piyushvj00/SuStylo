import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Save, Calendar, User, Upload, Tag, Image as ImageIcon } from 'lucide-react';

const BlogDetails = () => {
    const { id: blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        author: '',
        tags: '',
        category: '',
        metaTitle: '',
        metaDescription: '',
        contentHtml: '',
        contentJson: '',
        coverImage: null,
        images: [],
        isPublished: true
    });

    // Use a ref to track if we're fetching to prevent infinite loops
    const isFetchingRef = React.useRef(false);

    const fetchBlogDetails = React.useCallback(async () => {
        if (isFetchingRef.current) return;
        
        isFetchingRef.current = true;
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/blogs/${blogId}`);
            if (response.data.success) {
                const blogData = response.data.data;
                setBlog(blogData);
                setFormData({
                    title: blogData.title || '',
                    slug: blogData.slug || '',
                    author: blogData.author?._id || '',
                    tags: Array.isArray(blogData.tags) ? blogData.tags.join(', ') : blogData.tags || '',
                    category: blogData.category || '',
                    metaTitle: blogData.metaTitle || '',
                    metaDescription: blogData.metaDescription || '',
                    contentHtml: blogData.contentHtml || '',
                    contentJson: blogData.contentJson || '',
                    isPublished: blogData.isPublished || true
                });
            } else {
                throw new Error('Failed to fetch blog details');
            }
        } catch (error) {
            console.error('Error fetching blog details:', error);
            toast.error('Failed to load blog details');
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [blogId]);

    useEffect(() => {
        fetchBlogDetails();
    }, [fetchBlogDetails]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (e.target.name === 'coverImage') {
            setFormData(prev => ({
                ...prev,
                coverImage: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                images: files
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const submitData = new FormData();
            
            // Append all form data
            submitData.append('title', formData.title);
            submitData.append('slug', formData.slug);
            submitData.append('author', formData.author);
            submitData.append('tags', formData.tags);
            submitData.append('category', formData.category);
            submitData.append('metaTitle', formData.metaTitle);
            submitData.append('metaDescription', formData.metaDescription);
            submitData.append('contentHtml', formData.contentHtml);
            submitData.append('contentJson', formData.contentJson);
            submitData.append('isPublished', formData.isPublished);
            
            if (formData.coverImage) {
                submitData.append('coverImage', formData.coverImage);
            }
            
            if (formData.images.length > 0) {
                formData.images.forEach(image => {
                    submitData.append('images', image);
                });
            }

            const response = await axiosInstance.put(`/blogs/update/${blogId}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success('Blog updated successfully!');
                setEditing(false);
                fetchBlogDetails(); // Refresh data
            } else {
                throw new Error('Failed to update blog');
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            toast.error(error.response?.data?.message || 'Failed to update blog');
        } finally {
            setSaving(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        
        // Try different possible paths
        const baseUrl = 'http://localhost:5000';
        return `${baseUrl}/${imagePath}`;
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
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg">Blog not found.</p>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 mt-4 text-green-600 hover:text-green-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
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
                        // Edit Form
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

                                {/* Author ID */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Author ID *
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        User ID of the author
                                    </p>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        placeholder="web development, javascript, ai"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {/* Cover Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cover Image
                                    </label>
                                    <div className="flex items-center gap-4">
                                        {blog.coverImage && (
                                            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden relative">
                                                <img
                                                    src={getImageUrl(blog.coverImage)}
                                                    alt="Current cover"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        const fallback = e.target.parentElement.querySelector('.image-fallback');
                                                        if (fallback) fallback.style.display = 'flex';
                                                    }}
                                                />
                                                <div className="image-fallback absolute inset-0 hidden items-center justify-center bg-gray-200">
                                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                name="coverImage"
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

                                {/* Additional Images */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Images
                                    </label>
                                    <input
                                        type="file"
                                        name="images"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        You can select multiple images
                                    </p>
                                </div>

                                {/* Content HTML */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Content HTML *
                                    </label>
                                    <textarea
                                        name="contentHtml"
                                        value={formData.contentHtml}
                                        onChange={handleInputChange}
                                        rows="10"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        HTML content of the blog
                                    </p>
                                </div>

                                {/* Content JSON */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Content JSON
                                    </label>
                                    <textarea
                                        name="contentJson"
                                        value={formData.contentJson}
                                        onChange={handleInputChange}
                                        rows="5"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        JSON representation of content (optional)
                                    </p>
                                </div>

                                {/* Meta Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {/* Meta Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meta Description
                                    </label>
                                    <textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {/* Published Status */}
                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                name="isPublished"
                                                checked={formData.isPublished}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    isPublished: e.target.checked
                                                }))}
                                                className="sr-only"
                                                id="isPublishedCheckbox"
                                            />
                                            <div className={`block w-14 h-8 rounded-full ${formData.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${formData.isPublished ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                        <span className="ml-2 text-sm text-gray-700">Published</span>
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(false);
                                        fetchBlogDetails(); // Reset form data
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
                            {blog.coverImage && (
                                <div className="h-96 bg-gray-200 overflow-hidden relative">
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
                                                    <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                    <p class="text-gray-500">Image not available</p>
                                                </div>
                                            `;
                                            e.target.parentElement.appendChild(fallback);
                                        }}
                                    />
                                </div>
                            )}

                            <div className="p-8">
                                {/* Meta Information */}
                                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                                    <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span>{blog.author?.name || 'Admin'}</span>
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
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        blog.isPublished 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {blog.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </div>

                                {/* Title and Description */}
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
                                
                                {/* Tags */}
                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {blog.tags.map((tag, index) => (
                                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                                <Tag className="h-3 w-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Category */}
                                {blog.category && (
                                    <div className="mb-6">
                                        <span className="text-sm font-medium text-gray-700">Category: </span>
                                        <span className="text-sm text-gray-600">{blog.category}</span>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="prose max-w-none">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
                                        className="text-gray-700 leading-relaxed"
                                    />
                                </div>

                                {/* Additional Images */}
                                {blog.images && blog.images.length > 0 && (
                                    <div className="mt-8 pt-6 border-t">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Images</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {blog.images.map((image, index) => (
                                                <div key={index} className="bg-gray-100 rounded-lg overflow-hidden relative h-48">
                                                    <img
                                                        src={getImageUrl(image)}
                                                        alt={`${blog.title} - Image ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            const fallback = document.createElement('div');
                                                            fallback.className = 'w-full h-full flex items-center justify-center bg-gray-200';
                                                            fallback.innerHTML = `
                                                                <div class="text-center">
                                                                    <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                    </svg>
                                                                    <p class="text-gray-500 text-xs">Image ${index + 1}</p>
                                                                </div>
                                                            `;
                                                            e.target.parentElement.appendChild(fallback);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Meta Tags */}
                                {(blog.metaTitle || blog.metaDescription) && (
                                    <div className="mt-8 pt-6 border-t">
                                        <h3 className="font-semibold text-gray-900 mb-2">SEO Information</h3>
                                        <div className="grid grid-cols-1 gap-4 text-sm">
                                            {blog.metaTitle && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Meta Title:</span>
                                                    <p className="text-gray-600 mt-1">{blog.metaTitle}</p>
                                                </div>
                                            )}
                                            {blog.metaDescription && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Meta Description:</span>
                                                    <p className="text-gray-600 mt-1">{blog.metaDescription}</p>
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