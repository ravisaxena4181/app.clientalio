import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';
import { apiService } from '../services/api';
import Sidebar from './Sidebar';
import ProfileMenu from './ProfileMenu';

const WallOfLove = () => {
  const [user, setUser] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [wallTitle, setWallTitle] = useState('What our clients says about us!');
  const [wallSubtitle, setWallSubtitle] = useState('Read the our client\'s experience with clientalio.');
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('share');
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
      console.log('Fetching wall testimonials for userId:', userId);
      const data = await apiService.getWallTestimonials();
      console.log('Wall testimonials response:', data);
      
      // Extract testimonials from wallTestimonial array
      if (data && data.wallTestimonial) {
        setTestimonials(data.wallTestimonial);
        if (data.wallTitle) setWallTitle(data.wallTitle);
        if (data.wallSubtitle) setWallSubtitle(data.wallSubtitle);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      console.error('Failed to load wall testimonials:', error);
      console.error('Error details:', error.response?.data || error.message);
      // Fallback to regular testimonials if wall endpoint fails
      try {
        console.log('Falling back to regular testimonials endpoint');
        const fallbackData = await apiService.getTestimonials(userId);
        console.log('Fallback testimonials:', fallbackData);
        setTestimonials(Array.isArray(fallbackData) ? fallbackData : []);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setTestimonials([]);
      }
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
                Wall of love
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
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Wall of love</h1>
                <span className="text-3xl">❤️</span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('share')}
                  className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'share'
                      ? 'bg-gradient-to-r from-teal-400 to-teal-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-teal-500 hover:text-teal-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share link
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('embed')}
                  className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'embed'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-500 hover:text-purple-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Embed Code
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('weblink')}
                  className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'weblink'
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-pink-500 hover:text-pink-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Weblink
                  </span>
                </button>
              </div>
            </div>

            {/* Header Section */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {wallTitle}
              </h2>
              <p className="text-gray-600 text-lg">
                {wallSubtitle}
              </p>
            </div>

            {/* Testimonials Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="loading mb-4"></div>
                <p className="text-gray-600">Loading testimonials...</p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {!Array.isArray(testimonials) || testimonials.length === 0 ? (
                  <div className="break-inside-avoid flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-gray-100 rounded-full p-8 mb-6">
                      <svg className="w-24 h-24 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">No testimonials yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md">Start collecting testimonials to display on your wall of love</p>
                  </div>
                ) : (
                  Array.isArray(testimonials) && testimonials.map((testimonial) => {
                    if (testimonial.videoLinkRecorded) {
                      return (
                        // Video Testimonial Card
                        <div 
                          key={testimonial.id || `video-${testimonial.clientEmail}`} 
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
                      );
                    } else {
                      return (
                        // Text Testimonial Card
                        <div 
                          key={testimonial.id || `text-${testimonial.clientEmail}`} 
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

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <span className="font-semibold">clientalio</span>
                            <span className="text-primary">⚡</span>
                          </div>
                        </div>
                      </div>
                      );
                    }
                  })
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WallOfLove;
