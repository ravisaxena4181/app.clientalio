import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import '../styles/CollectTestimonial.css';

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
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
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
      // Upload video first
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
    <div className="collect-page">
      <div className="collect-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="container">
        <div className="collect-card">
          <h1>Collect Video Testimonial</h1>
          <p className="subtitle">Request and collect video testimonials from your clients</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <label htmlFor="clientName">Client Name *</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                placeholder="Enter client's full name"
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
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="client@example.com"
              />
            </div>

            <div className="input-group">
              <label htmlFor="video">Upload Video *</label>
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={handleVideoChange}
                required
              />
              {videoFile && (
                <div className="file-info">
                  Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-submit"
              disabled={loading || !videoFile}
            >
              {loading ? <span className="loading"></span> : 'Submit Testimonial'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollectTestimonial;
