import React from 'react';
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

          {/* Profile Menu */}
          <ProfileMenu 
            user={user}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            onLogout={onLogout}
          />
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
