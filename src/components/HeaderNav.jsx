import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';

const HeaderNav = ({ 
  user, 
  menuOpen, 
  setMenuOpen, 
  onLogout, 
  setSidebarOpen,
  pageTitle,
  sidebarCollapsed,
  setSidebarCollapsed
}) => {
  const navigate = useNavigate();
  return (
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
            {pageTitle}
          </h1>

          {/* Desktop Toggle Button */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed && setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sidebarCollapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                )}
              </svg>
            </button>
          </div>

          {/* Upgrade Button & Profile Menu */}
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={() => navigate('/upgrade')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold hidden sm:inline">Upgrade</span>
            </button>
            
            <ProfileMenu 
              user={user}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
