import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const CollectTestimonial = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    company: '',
    email: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError('Video file must be less than 100MB');
        return;
      }
      setVideoFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataObj = new FormData();
      formDataObj.append('video', videoFile);
      formDataObj.append('clientName', formData.clientName);
      formDataObj.append('company', formData.company);
      formDataObj.append('email', formData.email);

      await apiService.uploadVideo(formDataObj);
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Failed to submit testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors mb-6"
          onClick={() => navigate('/dashboard')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Collect Video Testimonial</h1>
            <p className="text-gray-600">Request and collect video testimonials from your clients</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <label htmlFor="clientName" className="flex items-center gap-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                placeholder="Enter client's full name"
                className="mt-1"
              />
            </div>

            <div className="input-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                className="mt-1"
              />
            </div>

            <div className="input-group">
              <label htmlFor="email" className="flex items-center gap-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="client@example.com"
                className="mt-1"
              />
            </div>

            <div className="input-group">
              <label htmlFor="video" className="flex items-center gap-1">
                Upload Video <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary transition-colors">
                <div className="space-y-2 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="video" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-secondary">
                      <span>Upload a video</span>
                      <input
                        id="video"
                        name="video"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        required
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">MP4, MOV, AVI up to 100MB</p>
                </div>
              </div>
              {videoFile && (
                <div className="mt-3 flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-green-800">
                    {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full py-4 text-lg font-semibold"
              disabled={loading || !videoFile}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading"></span>
                  Uploading...
                </span>
              ) : (
                'Submit Testimonial'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollectTestimonial;
