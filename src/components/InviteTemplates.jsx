import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';
import Sidebar from './Sidebar';
import ProfileMenu from './ProfileMenu';
import HeaderNav from './HeaderNav';
import Footer from './Footer';

const InviteTemplates = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = auth.getUser();
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const templates = [
    {
      id: 1,
      title: 'Share Your Experience',
      slug: 'my-invite-for-customer',
      type: 'page',
      preview: 'Share your thoughts — it only takes 60 seconds!',
      borderColor: 'border-blue-200'
    },
    {
      id: 2,
      title: 'Hey, I am requesting to leave a testimonial for bways team',
      slug: '0690482a-aaf4-442-b02b-a8378f3a26d',
      type: 'email',
      preview: 'You can simply reply to this email with a few sentences about your experience.',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
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
          pageTitle="Invite templates"
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Page Content */}
        <main className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
             
              {/* Title */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Invite templates</h1>
                <p className="text-gray-600">You can create or customize the testimonial collection page and share with your client.</p>
              </div>

              {/* Info Banner */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-gray-700">
                  You can add 2 text testimonial and 1 video testimonial collection template. 
                  <a href="#" className="text-blue-600 hover:underline ml-1">Upgrade now</a>
                </p>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 whitespace-nowrap transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Templates
                </button>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className={`bg-white rounded-lg border-t-4 ${template.borderColor} shadow-sm hover:shadow-md transition-shadow`}
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex-shrink-0 overflow-hidden">
                        {user?.profilePicture ? (
                          <img src={user.profilePicture} alt={user.displayName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                            {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                        <p className="text-sm text-gray-500">{template.slug}</p>
                      </div>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="p-6 bg-gray-50">
                    <p className="text-gray-600 italic">{template.preview}</p>
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-gray-100 flex flex-wrap gap-3">
                    <button className="text-sm text-gray-600 hover:text-primary flex items-center gap-1 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit template
                    </button>
                    {template.type === 'page' && (
                      <button className="text-sm text-gray-600 hover:text-primary flex items-center gap-1 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        add testimonials
                      </button>
                    )}
                    <button className="text-sm text-gray-600 hover:text-primary flex items-center gap-1 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      share link
                    </button>
                    <button className="text-sm text-gray-600 hover:text-primary flex items-center gap-1 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Embed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default InviteTemplates;
