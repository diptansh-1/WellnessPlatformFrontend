import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sessionAPI } from '../utils/api';
import { Save, Send, AlertCircle, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const SessionEditor = () => {
  const [formData, setFormData] = useState({
    title: '',
    tags: [],
    json_file_url: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // 'saving', 'saved', 'error'
  const [isEditing, setIsEditing] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const autoSaveTimeoutRef = useRef(null);
  const lastSavedDataRef = useRef('');

  // Initialize form with session data if editing
  useEffect(() => {
    if (location.state?.session) {
      const session = location.state.session;
      setFormData({
        title: session.title,
        tags: session.tags || [],
        json_file_url: session.json_file_url
      });
      setSessionId(session._id);
      setIsEditing(true);
      lastSavedDataRef.current = JSON.stringify({
        title: session.title,
        tags: session.tags || [],
        json_file_url: session.json_file_url
      });
    }
  }, [location.state]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    const currentData = JSON.stringify(formData);
    
    // Don't auto-save if data hasn't changed or if required fields are empty
    if (currentData === lastSavedDataRef.current || !formData.title || !formData.json_file_url) {
      return;
    }

    try {
      setAutoSaveStatus('saving');
      
      const saveData = {
        ...formData,
        ...(sessionId && { sessionId })
      };

      const response = await sessionAPI.saveDraft(saveData);
      
      if (response.data.success) {
        if (!sessionId) {
          setSessionId(response.data.data._id);
          setIsEditing(true);
        }
        lastSavedDataRef.current = currentData;
        setAutoSaveStatus('saved');
        

        setTimeout(() => setAutoSaveStatus(''), 3000);
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    }
  }, [formData, sessionId]);

  // Setup auto-save timer
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, parseInt(process.env.REACT_APP_AUTO_SAVE_DELAY || '5000'));

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, autoSave]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.json_file_url.trim()) {
      newErrors.json_file_url = 'JSON file URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.json_file_url)) {
      newErrors.json_file_url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const saveData = {
        ...formData,
        ...(sessionId && { sessionId })
      };

      const response = await sessionAPI.saveDraft(saveData);
      
      if (response.data.success) {
        if (!sessionId) {
          setSessionId(response.data.data._id);
          setIsEditing(true);
        }
        lastSavedDataRef.current = JSON.stringify(formData);
        toast.success('Draft saved successfully!');
      }
    } catch (error) {
      console.error('Save draft error:', error);
      const message = error.response?.data?.message || 'Failed to save draft';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const publishData = {
        ...formData,
        ...(sessionId && { sessionId })
      };

      const response = await sessionAPI.publishSession(publishData);
      
      if (response.data.success) {
        toast.success('Session published successfully!');
        navigate('/my-sessions');
      }
    } catch (error) {
      console.error('Publish error:', error);
      const message = error.response?.data?.message || 'Failed to publish session';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getAutoSaveIndicator = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return (
          <div className="flex items-center text-blue-600 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
            Auto-saving...
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center text-green-600 text-sm">
            <Check className="w-4 h-4 mr-2" />
            Auto-saved
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-600 text-sm">
            <X className="w-4 h-4 mr-2" />
            Auto-save failed
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEditing ? 'Edit Session' : 'Create New Session'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update your wellness session' : 'Create a new wellness session for the community'}
            </p>
          </div>
          
          {/* Auto-save indicator */}
          <div className="text-right">
            {getAutoSaveIndicator()}
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg border">
          <div className="px-6 py-8 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Session Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a descriptive title for your session"
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.title ? (
                  <p className="text-sm text-red-600">{errors.title}</p>
                ) : (
                  <div></div>
                )}
                <span className="text-xs text-gray-500">
                  {formData.title.length}/200
                </span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="yoga, meditation, wellness (comma-separated)"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-sm text-gray-500">
                Add relevant tags separated by commas to help users find your session
              </p>
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* JSON File URL */}
            <div>
              <label htmlFor="json_file_url" className="block text-sm font-medium text-gray-700 mb-2">
                JSON File URL *
              </label>
              <input
                type="url"
                id="json_file_url"
                name="json_file_url"
                value={formData.json_file_url}
                onChange={handleChange}
                placeholder="https://example.com/session-data.json"
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.json_file_url ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.json_file_url && (
                <p className="mt-1 text-sm text-red-600">{errors.json_file_url}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Provide a publicly accessible URL to your session's JSON data file
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate('/my-sessions')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save as Draft
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Publish Session
            </button>
          </div>
        </div>
      </form>

      {/* Auto-save Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Auto-save Enabled
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Your session is automatically saved as a draft every 5 seconds while you type. 
                You can manually save or publish your session at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionEditor;
