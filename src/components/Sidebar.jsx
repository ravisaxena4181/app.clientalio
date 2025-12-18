import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo_transbg.png';

const Sidebar = ({ 
  user, 
  sidebarOpen, 
  setSidebarOpen, 
  onLogout,
  activeMenu, // optional, if not provided will use location.pathname
  isCollapsed,
  setIsCollapsed
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  // Use passed state if provided, otherwise use internal state
  const collapsed = isCollapsed !== undefined ? isCollapsed : internalCollapsed;
  const toggleCollapsed = setIsCollapsed || setInternalCollapsed;

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'testimonials',
      name: 'Collected Testimonials',
      path: '/testimonials',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'embed',
      name: 'Embed Testimonial',
      path: '/embed',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      id: 'templates',
      name: 'Invite Templates',
      path: '/templates',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'wall',
      name: 'Wall of Love',
      path: '/wall',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 'upgrade',
      name: 'Upgrade',
      path: '/upgrade',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
  ];

  const currentPath = activeMenu || location.pathname;
  
  const isActive = (item) => {
    if (activeMenu) {
      return activeMenu === item.id;
    }
    return currentPath === item.path;
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {!collapsed && <img src={logo} alt="Clientalio" className="h-10 w-auto" />}
            {collapsed && (
              <div className="w-full flex justify-center">
                <img src={logo} alt="Clientalio" className="h-8 w-8 object-contain" />
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          
          {/* User Profile Section */}
          {!collapsed && (
            <div className="px-4 py-4">
              <div className="bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg shadow-lg overflow-hidden">
                <div 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="p-3 flex items-center justify-between cursor-pointer hover:opacity-90 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden flex-shrink-0 ring-2 ring-white/50">
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} alt={user.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                          {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-white/80 truncate">
                        {user?.email || ''}
                      </p>
                    </div>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-white flex-shrink-0 transition-transform duration-200 ml-2 ${profileMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Profile Submenu */}
                {profileMenuOpen && (
                  <div className="bg-white border-t border-white/20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileMenuOpen(false);
                        // navigate('/profile');
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-400 cursor-not-allowed flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileMenuOpen(false);
                        // navigate('/settings');
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-400 cursor-not-allowed flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Account Settings
                    </button>
                    
                   
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Collapsed User Profile */}
          {collapsed && (
            <div className="px-4 py-4 flex justify-center">
              <div className="relative p-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full">
                <div 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 overflow-hidden flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow relative"
                >
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-semibold text-lg">
                      {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PERSONAL Label */}
          {!collapsed && (
            <div className="px-6 mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick links</span>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  }
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 ${collapsed ? 'justify-center' : ''} px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item)
                    ? 'bg-slate-600 text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                title={collapsed ? item.name : ''}
              >
                {item.icon}
                {!collapsed && item.name}
              </button>
            ))}
            {/* Logout */}
            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-3 ${collapsed ? 'justify-center' : ''} px-4 py-3 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-200`}
              title={collapsed ? 'Logout' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!collapsed && 'Logout'}
            </button>
           
          </nav>
        </div>
      </aside>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
