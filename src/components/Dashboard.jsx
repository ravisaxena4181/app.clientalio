import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';
import { apiService } from '../services/api';
import logo from '../assets/logo_transbg.png';

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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <img src={logo} alt="Clientalio" className="h-10 md:h-12 w-auto" />
            <div className="flex items-center gap-3 md:gap-4">
              <span className="hidden md:inline text-sm text-gray-600">{user?.displayName || user?.email}</span>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Video Testimonials</h1>
            <button 
              className="btn btn-primary flex items-center justify-center gap-2"
              onClick={() => navigate('/collect')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Collect Testimonial
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="loading mb-4"></div>
              <p className="text-gray-600">Loading testimonials...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-gray-100 rounded-full p-8 mb-6">
                    <svg className="w-24 h-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">No testimonials yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md">Start collecting video testimonials from your clients to showcase social proof</p>
                  <button className="btn btn-primary" onClick={() => navigate('/collect')}>
                    Get Started
                  </button>
                </div>
              ) : (
                testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-video bg-black">
                      <video controls className="w-full h-full object-cover">
                        <source src={testimonial.videoUrl} type="video/mp4" />
                      </video>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{testimonial.clientName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{testimonial.company}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(testimonial.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
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
