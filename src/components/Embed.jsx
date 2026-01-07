import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';
import { apiService } from '../services/api';
import Sidebar from './Sidebar';
import ProfileMenu from './ProfileMenu';
import HeaderNav from './HeaderNav';
import Footer from './Footer';

const Embed = () => {
  const [user, setUser] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [selectedTestimonials, setSelectedTestimonials] = useState([]);
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

  const toggleTestimonialSelection = (testimonialId) => {
    setSelectedTestimonials(prev => {
      if (prev.includes(testimonialId)) {
        return prev.filter(id => id !== testimonialId);
      } else {
        return [...prev, testimonialId];
      }
    });
  };

  const isSelected = (testimonialId) => {
    return selectedTestimonials.includes(testimonialId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        activeMenu="embed"
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top Navbar */}
        <HeaderNav 
          user={user}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          onLogout={handleLogout}
          setSidebarOpen={setSidebarOpen}
          pageTitle="Embed Testimonials"
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Page Content */}
        <main className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Embed Testimonials</h1>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  onClick={() => {
                    if (selectedTestimonials.length > 0) {
                      setSelectedTestimonials([]);
                    }
                  }}
                >
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Make Selectable
                </button>
                <button 
                  className="px-6 py-3 bg-orange-400 text-white font-medium rounded-lg hover:bg-orange-500 transition-colors flex items-center gap-2"
                  disabled={selectedTestimonials.length === 0}
                  onClick={() => {
                    console.log('Adding to widget:', selectedTestimonials);
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add to Widget
                </button>
                <button 
                  className="px-6 py-3 border-2 border-teal-500 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-2"
                  onClick={() => {
                    // Navigate to widget history or show modal
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Show Widget History
                </button>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="loading mb-4"></div>
                <p className="text-gray-600">Loading testimonials...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-100 rounded-full p-8 mb-6">
                  <svg className="w-24 h-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No testimonials yet</h3>
                <p className="text-gray-600 mb-6 max-w-md">Start collecting testimonials to embed them on your website</p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {testimonials.map((testimonial) => {
                    const selected = isSelected(testimonial.id);
                    
                    if (testimonial.videoLinkRecorded) {
                      return (
                        <div 
                          key={testimonial.id} 
                          className={`break-inside-avoid mb-6 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer relative ${selected ? 'ring-4 ring-blue-500' : ''}`}
                          onClick={() => toggleTestimonialSelection(testimonial.id)}
                        >
                          {selected && (
                            <div className="absolute top-4 left-4 z-40 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Video Thumbnail */}
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
                              id={`video-${testimonial.id}`}
                              className="relative w-full h-full object-cover z-10"
                              poster={testimonial.imageLinkUploaded}
                              controls={playingVideo === testimonial.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayVideo(testimonial.id);
                              }}
                            >
                              <source src={testimonial.videoLinkRecorded} type="video/mp4" />
                            </video>
                            
                            {playingVideo !== testimonial.id && (
                              <>
                                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all z-20"></div>
                                <div 
                                  className="absolute inset-0 flex items-center justify-center z-30 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
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
                              </>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                {testimonial.imageLinkUploaded ? (
                                  <img src={testimonial.imageLinkUploaded} alt={testimonial.clientName} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-primary text-white font-semibold">
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
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(testimonial.createdAt).toLocaleDateString('en-US', { 
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric'
                                    })} {new Date(testimonial.createdAt).toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Star Ratings */}
                            {testimonial.ratings && testimonial.ratings > 0 && (
                              <div className="flex items-center gap-1 mb-4">
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
                            )}

                            {/* Footer Badge */}
                            <div className="flex items-center justify-center pt-3 border-t border-gray-100">
                              <span className="text-xs text-gray-500 font-medium">TRUSTED BY C</span>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div 
                          key={testimonial.id} 
                          className={`break-inside-avoid mb-6 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative cursor-pointer ${selected ? 'ring-4 ring-blue-500' : ''}`}
                          onClick={() => toggleTestimonialSelection(testimonial.id)}
                        >
                          {selected && (
                            <div className="absolute top-4 right-4 z-40 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}

                          {/* Header with Profile */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                              {testimonial.imageLinkUploaded ? (
                                <img src={testimonial.imageLinkUploaded} alt={testimonial.clientName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary text-white font-semibold">
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
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(testimonial.createdAt).toLocaleDateString('en-US', { 
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })} {new Date(testimonial.createdAt).toLocaleTimeString('en-US', {
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
                                  className={`w-5 h-5 ${index < testimonial.ratings ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          )}

                          {/* Footer Badge */}
                          <div className="flex items-center justify-center pt-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500 font-medium">TRUSTED BY C</span>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Embed;
