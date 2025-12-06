import React, { useState } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import Tiptap from './Tiptap';

const CreateBlog = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({
            ...prev,
            content: content
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate required fields
        if (!formData.title || !formData.slug || !formData.description || !formData.author || !formData.content) {
            toast.error('Please fill all required fields');
            setLoading(false);
            return;
        }

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

            const response = await axiosInstance.post('/blogs', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Blog created successfully!');
            navigate('/blog');
        } catch (error) {
            console.error('Error creating blog:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to create blog');
            }
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer />
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        to="/blog"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
                        <p className="text-gray-600 mt-2">Write and publish a new blog post</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
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
                                onChange={(e) => {
                                    handleInputChange(e);
                                    // Auto-generate slug from title
                                    setFormData(prev => ({
                                        ...prev,
                                        slug: generateSlug(e.target.value)
                                    }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter blog title"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="blog-url-slug"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                This will be used in the URL for your blog post
                            </p>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Brief description of your blog post"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Author name"
                                required
                            />
                        </div>

                        {/* Featured Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Featured Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Recommended size: 1200x630 pixels
                            </p>
                        </div>

                        {/* Content */}
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
                            <p className="text-xs text-gray-500 mt-1">
                                Write your blog content using the rich text editor above
                            </p>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Keywords for SEO, separated by commas
                            </p>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Brief meta description for SEO"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                This description will appear in search engine results
                            </p>
                        </div>
                    </div>

                    {/* Form Preview (Optional) */}
                    {formData.title && (
                        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">Preview</h3>
                            <div className="text-sm text-gray-600">
                                <p><strong>Title:</strong> {formData.title}</p>
                                <p><strong>Slug:</strong> {formData.slug}</p>
                                <p><strong>Description:</strong> {formData.description}</p>
                                <p><strong>Author:</strong> {formData.author}</p>
                                <p><strong>Content Length:</strong> {formData.content ? formData.content.length : 0} characters</p>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                        <Link
                            to="/blog"
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Create Blog
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBlog;