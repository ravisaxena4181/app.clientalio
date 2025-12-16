import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../utils/auth';
import { apiService } from '../services/api';
import Sidebar from './Sidebar';

const Testimonials = () => {
  const [user, setUser] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
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
                My Testimonials
              </h1>

              <div className="hidden lg:block"></div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                      {user?.displayName || user?.email}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            // navigate('/profile');
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-400 cursor-not-allowed flex items-center gap-3"
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </button>
                        
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            // navigate('/settings');
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-400 cursor-not-allowed flex items-center gap-3"
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Account Settings
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Testimonials</h1>
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
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {testimonials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
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
                  testimonial.videoLinkRecorded ? (
                    // Video Testimonial Card
                    <div 
                      key={testimonial.id} 
                      className="break-inside-avoid mb-6 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                    {/* Video Thumbnail */}
                    <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-700 overflow-hidden group">
                      {/* Blurred Background Image */}
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
                        id={`video-${testimonial.id}`}
                        className="relative w-full h-full object-cover z-10"
                        poster={testimonial.imageLinkUploaded}
                        controls={playingVideo === testimonial.id}
                        onClick={() => handlePlayVideo(testimonial.id)}
                      >
                        <source src={testimonial.videoLinkRecorded} type="video/mp4" />
                      </video>
                      
                      {/* Overlay */}
                      {playingVideo !== testimonial.id && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all z-20"></div>
                      )}
                      
                      {/* Play Button */}
                      {playingVideo !== testimonial.id && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center z-30 cursor-pointer"
                          onClick={() => {
                            handlePlayVideo(testimonial.id);
                            const video = document.getElementById(`video-${testimonial.id}`);
                            if (video) video.play();
                          }}
                        >
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Category Badge */}
                      {testimonial.category && (
                        <div className="absolute top-4 left-4 z-30">
                          <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                            {testimonial.category}
                          </span>
                        </div>
                      )}

                      {/* Duration Badge */}
                      {testimonial.duration && (
                        <div className="absolute top-4 right-4 z-30">
                          <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-medium rounded flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {testimonial.duration}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Name */}
                      <h3 className="text-xl font-semibold text-primary mb-1">
                        {testimonial.clientName}
                      </h3>
                      
                      {/* Work Title & Company */}
                      <div className="mb-3">
                        {testimonial.workTitle && (
                          <p className="text-sm text-gray-900 font-medium">{testimonial.workTitle}</p>
                        )}
                        {testimonial.companyName && (
                          <p className="text-sm text-gray-600">{testimonial.companyName}</p>
                        )}
                      </div>

                      {/* Star Ratings */}
                      {testimonial.ratings && testimonial.ratings > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, index) => (
                              <svg
                                key={index}
                                className={`w-5 h-5 ${index < testimonial.ratings ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{testimonial.ratings}.0</span>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        {testimonial.createdAt && (
                          <span className="text-xs text-gray-500">
                            {new Date(testimonial.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        )}
                        <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                          Watch now
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  ) : (
                    // Text Testimonial Card
                    <div 
                      key={testimonial.id} 
                      className="break-inside-avoid mb-6 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative"
                    >
                      {/* Heart Icon */}
                      <div className="absolute top-4 left-4">
                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>

                      {/* Header with Profile */}
                      <div className="flex items-start gap-4 mb-4 mt-8">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          {testimonial.imageLinkUploaded ? (
                            <img src={testimonial.imageLinkUploaded} alt={testimonial.clientName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary text-white font-semibold text-xl">
                              {(testimonial.clientName || 'C').charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{testimonial.clientName}</h3>
                          {testimonial.workTitle && (
                            <p className="text-sm text-gray-600">{testimonial.workTitle}</p>
                          )}
                          {testimonial.createdAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(testimonial.createdAt).toLocaleDateString('en-US', { 
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              }) + ' ' + new Date(testimonial.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Testimonial Text */}
                      <div className="mb-4">
                        <div 
                          className="text-gray-700 italic leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: testimonial.textRecorded || 'Great experience working with this company!'
                          }}
                        />
                        {testimonial.clientName && (
                          <p className="text-sm text-gray-500 mt-2">
                            — Reviews by {testimonial.clientName}
                          </p>
                        )}
                      </div>

                      {/* Star Ratings */}
                      {testimonial.ratings && testimonial.ratings > 0 && (
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, index) => (
                            <svg
                              key={index}
                              className={`w-6 h-6 ${index < testimonial.ratings ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}

                      {/* Trusted Badge */}
                      <div className="mb-4">
                       
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                        <button className="text-sm text-yellow-600 font-medium hover:underline flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit Highlight
                        </button>
                        <button className="text-sm text-gray-600 hover:text-red-600 font-medium hover:underline flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                ))
              )}
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  );
};

export default Testimonials;
