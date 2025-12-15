import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';
import { apiService } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = auth.getUser();
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    loadTestimonials();
  }, [navigate]);

  const loadTestimonials = async () => {
    try {
      const data = await apiService.getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="navbar-brand">
            <img src="/src/assets/logo_transbg.png" alt="Clientalio" className="logo-navbar" />
          </div>
          <div className="navbar-actions">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-header">
            <h1>Video Testimonials</h1>
            <button className="btn btn-primary" onClick={() => navigate('/collect')}>
              + Collect Testimonial
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading"></div>
              <p>Loading testimonials...</p>
            </div>
          ) : (
            <div className="testimonials-grid">
              {testimonials.length === 0 ? (
                <div className="empty-state">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="60" fill="#F8F9FA"/>
                    <path d="M60 30v60M30 60h60" stroke="#FF8C42" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                  <h3>No testimonials yet</h3>
                  <p>Start collecting video testimonials from your clients</p>
                  <button className="btn btn-primary" onClick={() => navigate('/collect')}>
                    Get Started
                  </button>
                </div>
              ) : (
                testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="testimonial-card">
                    <div className="testimonial-video">
                      <video controls>
                        <source src={testimonial.videoUrl} type="video/mp4" />
                      </video>
                    </div>
                    <div className="testimonial-info">
                      <h3>{testimonial.clientName}</h3>
                      <p>{testimonial.company}</p>
                      <span className="testimonial-date">
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
