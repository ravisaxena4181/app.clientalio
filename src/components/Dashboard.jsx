import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';
import { apiService } from '../services/api';
import Sidebar from './Sidebar';
import ProfileMenu from './ProfileMenu';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [playingVideo, setPlayingVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = auth.getUser();
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    loadTestimonials(userData.userId);
  }, [navigate]);

  const loadTestimonials = async (userId) => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const data = await apiService.getTestimonials(userId);
      console.log('Fetched testimonials:', data);
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

  const handlePlayVideo = (videoId) => {
    setPlayingVideo(videoId);
  };

  const handlePauseVideo = () => {
    setPlayingVideo(null);
  };

  // Calculate average rating from testimonials
  const averageRating = useMemo(() => {
    if (!testimonials || testimonials.length === 0) return 0;
    
    const testimonialsWithRatings = testimonials.filter(t => {
      if (!t.ratings) return false;
      const numRating = Number(t.ratings);
      return !isNaN(numRating) && numRating > 0;
    });
    
    if (testimonialsWithRatings.length === 0) return 0;
    
    const totalRating = testimonialsWithRatings.reduce((sum, t) => sum + Number(t.ratings), 0);
    const average = totalRating / testimonialsWithRatings.length;
    
    return Math.round(average * 10) / 10; // Round to 1 decimal place
  }, [testimonials]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        activeMenu={activeMenu}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navbar */}
        <nav className="bg-white shadow-md sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Page Title */}
              <h1 className="text-xl font-semibold text-gray-900 lg:hidden">
                Dashboard
              </h1>

              <div className="hidden lg:block"></div>

              {/* Profile Menu */}
              <ProfileMenu 
                user={user}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.displayName || user?.email || 'User'} 👋
              </h1>
              <p className="text-sm sm:text-base text-gray-600">you've collected {testimonials.length} testimonials!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button 
                className="px-6 py-3 border-2 border-teal-500 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-2"
                onClick={() => navigate('/wall')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Widget
              </button>
              <button 
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                onClick={() => navigate('/templates')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Invite
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Testimonials Card */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold text-purple-800">
                      {testimonials.length}/{testimonials.length + 3}
                    </div>
                    <div className="text-xs sm:text-sm text-purple-700 font-medium mt-1">Total testimonials</div>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded-xl p-2 sm:p-3">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Templates Card */}
            <div className="bg-gradient-to-br from-red-100 to-pink-200 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold text-red-800">1/2</div>
                    <div className="text-xs sm:text-sm text-red-700 font-medium mt-1">Text collect templates</div>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded-xl p-2 sm:p-3">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Templates Card */}
            <div className="bg-gradient-to-br from-green-100 to-teal-200 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold text-teal-800">1/1</div>
                    <div className="text-xs sm:text-sm text-teal-700 font-medium mt-1">Video collect templates</div>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded-xl p-2 sm:p-3">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Average Rating Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-500 mb-2">
                    {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm sm:text-base text-orange-500 font-normal">Avg. Rating</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="loading mb-4"></div>
              <p className="text-gray-600">Loading testimonials...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Collection Templates Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Collection Templates</h2>
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No templates available</p>
                  <button 
                    className="mt-4 text-primary hover:underline text-sm font-medium"
                    onClick={() => navigate('/templates')}
                  >
                    Create your first template
                  </button>
                </div>
              </div>

              {/* Recent Testimonials Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Testimonials</h2>
                {testimonials.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">No testimonials yet</p>
                    <button 
                      className="mt-4 text-primary hover:underline text-sm font-medium"
                      onClick={() => navigate('/collect')}
                    >
                      Collect your first testimonial
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {testimonials.slice(0, 3).map((testimonial) => {
                      if (testimonial.videoLinkRecorded) {
                        return (
                          <div 
                            key={testimonial.id}
                            className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-700 overflow-hidden group">
                              {testimonial.imageLinkUploaded && (
                                <div 
                                  className="absolute inset-0 bg-cover bg-center"
                                  style={{
                                    backgroundImage: `url(${testimonial.imageLinkUploaded})`,
                                    filter: 'blur(20px)',
                                    transform: 'scale(1.1)',
                                  }}
                                ></div>
                              )}
                              
                              <video 
                                id={`video-recent-${testimonial.id}`}
                                className="relative w-full h-full object-cover z-10"
                                poster={testimonial.imageLinkUploaded}
                                controls={playingVideo === `recent-${testimonial.id}`}
                              >
                                <source src={testimonial.videoLinkRecorded} type="video/mp4" />
                              </video>
                              
                              {playingVideo !== `recent-${testimonial.id}` && (
                                <>
                                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all z-20"></div>
                                  <div 
                                    className="absolute inset-0 flex items-center justify-center z-30 cursor-pointer"
                                    onClick={() => {
                                      handlePlayVideo(`recent-${testimonial.id}`);
                                      const video = document.getElementById(`video-recent-${testimonial.id}`);
                                      if (video) video.play();
                                    }}
                                  >
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                      <svg className="w-6 h-6 text-primary ml-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                      </svg>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            <div className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                  {testimonial.imageLinkUploaded ? (
                                    <img src={testimonial.imageLinkUploaded} alt={testimonial.clientName} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary text-white font-semibold text-sm">
                                      {(testimonial.clientName || 'C').charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 text-sm truncate">{testimonial.clientName}</h4>
                                  <p className="text-xs text-gray-500 truncate">{testimonial.workTitle || 'Customer'}</p>
                                </div>
                                {testimonial.createdAt && (
                                  <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {new Date(testimonial.createdAt).toLocaleDateString('en-US', { 
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric'
                                    }).replace(',', '')} {new Date(testimonial.createdAt).toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div 
                            key={testimonial.id}
                            className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                {testimonial.imageLinkUploaded ? (
                                  <img src={testimonial.imageLinkUploaded} alt={testimonial.clientName} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-primary text-white font-semibold text-sm">
                                    {(testimonial.clientName || 'C').charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm">{testimonial.clientName}</h4>
                                <p className="text-xs text-gray-500">{testimonial.workTitle || 'Customer'}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                              {testimonial.textRecorded?.replace(/<[^>]*>/g, '') || 'Great experience!'}
                            </p>
                            {testimonial.ratings && testimonial.ratings > 0 && (
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, index) => (
                                  <svg
                                    key={index}
                                    className={`w-4 h-4 ${index < testimonial.ratings ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }
                    })}
                    {testimonials.length > 3 && (
                      <button 
                        className="w-full py-2 text-center text-primary hover:underline text-sm font-medium"
                        onClick={() => navigate('/testimonials')}
                      >
                        View all {testimonials.length} testimonials →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  );
};

export default Dashboard;
