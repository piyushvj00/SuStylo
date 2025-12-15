import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, ChevronDown, User, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Tiptap from './Tiptap';

const CreateBlog = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [authors, setAuthors] = useState([]);
    const [loadingAuthors, setLoadingAuthors] = useState(false);
    const [authorError, setAuthorError] = useState('');
    const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        author: '',
        authorName: '',
        tags: '',
        category: '',
        metaTitle: '',
        metaDescription: '',
        contentHtml: '<p>Start writing your blog content here...</p>',
        contentJson: '',
        coverImage: null,
        images: [],
        isPublished: true
    });

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            setLoadingAuthors(true);
            setAuthorError('');
            
            // Try different endpoints in case the path is different
            let response;
            try {
                response = await axiosInstance.get('/admins/alladmins');
            } catch (firstError) {
                console.log('Trying alternative endpoint...');
                try {
                    // Try alternative endpoint
                    response = await axiosInstance.get('/admins');
                } catch (secondError) {
                    console.log('Trying /users endpoint...');
                    try {
                        // Try users endpoint
                        response = await axiosInstance.get('/users/admins');
                    } catch (thirdError) {
                        throw new Error('Could not fetch authors from any endpoint');
                    }
                }
            }
            
            // Check if response is HTML error page
            if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
                throw new Error('Server returned HTML error page');
            }
            
            // Check response structure
            console.log('Authors API Response:', response.data);
            
            if (response.data && response.data.success) {
                // Filter only super admins
                const superAdmins = response.data.data.filter(admin => 
                    admin && 
                    admin.role === 'super_admin' && 
                    admin.status === 'active' && 
                    !admin.isDeleted
                );
                
                if (superAdmins.length === 0) {
                    // If no super admins, show all active admins
                    const activeAdmins = response.data.data.filter(admin => 
                        admin && 
                        admin.status === 'active' && 
                        !admin.isDeleted
                    );
                    setAuthors(activeAdmins);
                    
                    if (activeAdmins.length === 0) {
                        setAuthorError('No active authors found');
                    }
                } else {
                    setAuthors(superAdmins);
                }
            } else {
                throw new Error(response.data?.message || 'Failed to fetch authors');
            }
        } catch (error) {
            console.error('Error fetching authors:', error);
            setAuthorError(`Failed to load authors: ${error.message}`);
            toast.error('Could not load authors list. Please enter author ID manually.');
            
            // Set default or fallback authors
            setAuthors([{
                _id: '68c5131f14e7e90bc6ce3fda',
                name: 'chandan sharma',
                email: 'rahuljsrasr1112@gmail.com',
                role: 'super_admin',
                status: 'active'
            }]);
        } finally {
            setLoadingAuthors(false);
        }
    };

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

    const handleContentChange = (content) => {
        setFormData(prev => ({
            ...prev,
            contentHtml: content
        }));
    };

    const selectAuthor = (author) => {
        setFormData(prev => ({
            ...prev,
            author: author._id,
            authorName: author.name
        }));
        setShowAuthorDropdown(false);
    };

    // Manual author input as fallback
    const handleManualAuthorInput = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            author: value,
            authorName: value ? `Manual ID: ${value}` : ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate required fields
        if (!formData.title || !formData.slug || !formData.author || !formData.contentHtml || formData.contentHtml === '<p></p>') {
            toast.error('Please fill all required fields and add some content');
            setLoading(false);
            return;
        }

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

            console.log('Submitting blog data:', {
                title: formData.title,
                slug: formData.slug,
                author: formData.author,
                tags: formData.tags,
                category: formData.category,
                contentLength: formData.contentHtml.length
            });

            const response = await axiosInstance.post('/blogs/create', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Blog creation response:', response.data);

            if (response.data.success) {
                toast.success('Blog created successfully!');
                navigate('/blog');
            } else {
                throw new Error(response.data.message || 'Failed to create blog');
            }
        } catch (error) {
            console.error('Error creating blog:', error);
            if (error.response?.data) {
                console.error('Error response data:', error.response.data);
                
                // Check if it's an HTML error
                if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
                    toast.error('Server error: Received HTML error page. Check server logs.');
                } else if (error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Failed to create blog: Server error');
                }
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error('Failed to create blog. Please check console for details.');
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

                        {/* Author Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Author *
                            </label>
                            
                            {/* Author Dropdown */}
                            <div className="relative mb-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAuthorDropdown(!showAuthorDropdown)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                                    disabled={loadingAuthors}
                                >
                                    <div className="flex items-center gap-2">
                                        {formData.authorName ? (
                                            <>
                                                <User className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-700">{formData.authorName}</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-500">
                                                {loadingAuthors ? 'Loading authors...' : 'Select an author'}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showAuthorDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {/* Dropdown Menu */}
                                {showAuthorDropdown && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {loadingAuthors ? (
                                            <div className="p-3 text-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mx-auto"></div>
                                                <p className="text-sm text-gray-500 mt-2">Loading authors...</p>
                                            </div>
                                        ) : authorError ? (
                                            <div className="p-3 text-center">
                                                <AlertCircle className="h-5 w-5 text-red-500 mx-auto mb-2" />
                                                <p className="text-sm text-red-500">{authorError}</p>
                                            </div>
                                        ) : authors.length === 0 ? (
                                            <div className="p-3 text-center text-gray-500">
                                                No authors available
                                            </div>
                                        ) : (
                                            <div className="py-1">
                                                {authors.map((author) => (
                                                    <button
                                                        key={author._id}
                                                        type="button"
                                                        onClick={() => selectAuthor(author)}
                                                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                                                            formData.author === author._id ? 'bg-green-50 text-green-700' : 'text-gray-700'
                                                        }`}
                                                    >
                                                        <div className="flex-1">
                                                            <div className="font-medium">{author.name}</div>
                                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                                <span>{author.email}</span>
                                                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                                    author.role === 'super_admin' 
                                                                        ? 'bg-blue-100 text-blue-800' 
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                    {author.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {formData.author === author._id && (
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Manual Author Input as Fallback */}
                            <div className="mt-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Or enter author ID manually:
                                </label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={handleManualAuthorInput}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter author ID (e.g., 68c5131f14e7e90bc6ce3fda)"
                                />
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-1">
                                Select the author who wrote this blog post or enter the author ID manually
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                placeholder="Technology"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Image
                            </label>
                            <input
                                type="file"
                                name="coverImage"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Recommended size: 1200x630 pixels
                            </p>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            />
                        </div>

                        {/* Content with Tiptap Editor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content *
                            </label>
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <Tiptap
                                    content={formData.contentHtml}
                                    onChange={handleContentChange}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Write your blog content using the rich text editor above
                            </p>
                        </div>

                        {/* Content JSON (Optional) */}
                        <div className="relative">
                            <details className="group">
                                <summary className="cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <span>Advanced: Content JSON (Optional)</span>
                                    <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="mt-2">
                                    <textarea
                                        name="contentJson"
                                        value={formData.contentJson}
                                        onChange={handleInputChange}
                                        rows="5"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                                        placeholder='{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Your content here"}]}]}'
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        JSON representation of content (optional)
                                    </p>
                                </div>
                            </details>
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
                                placeholder="SEO title for search engines"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Brief meta description for SEO"
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
                                    <div className={`block w-14 h-8 rounded-full ${formData.isPublished ? 'bg-green-500' : 'bg-gray-300'} transition-colors`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${formData.isPublished ? 'translate-x-6' : ''} shadow-md`}></div>
                                </div>
                                <span className="text-sm text-gray-700">Publish immediately</span>
                            </label>
                        </div>
                    </div>

                    {/* Form Preview */}
                    {formData.title && (
                        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">Preview</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>Title:</strong> {formData.title}</p>
                                <p><strong>Slug:</strong> {formData.slug}</p>
                                <p><strong>Author:</strong> {formData.authorName || formData.author || 'Not selected'}</p>
                                <p><strong>Tags:</strong> {formData.tags || 'None'}</p>
                                <p><strong>Category:</strong> {formData.category || 'Not specified'}</p>
                                <p><strong>Status:</strong> {formData.isPublished ? 'Published' : 'Draft'}</p>
                                <p><strong>Content Length:</strong> {formData.contentHtml.replace(/<[^>]*>/g, '').length} characters</p>
                                {formData.metaTitle && <p><strong>Meta Title:</strong> {formData.metaTitle}</p>}
                                {formData.metaDescription && <p><strong>Meta Description:</strong> {formData.metaDescription.substring(0, 100)}...</p>}
                            </div>
                        </div>
                    )}

                    {/* Debug Info (for troubleshooting) */}
                    <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">Debug Info:</span>
                        </div>
                        <div className="text-xs text-yellow-700 mt-1 space-y-1">
                            <p>Authors loaded: {authors.length}</p>
                            <p>Selected Author ID: {formData.author || 'None'}</p>
                            <p>Author Name: {formData.authorName || 'None'}</p>
                            <p>API Status: {authorError ? 'Error: ' + authorError : 'OK'}</p>
                        </div>
                    </div>

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