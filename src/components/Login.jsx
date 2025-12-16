import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { auth } from '../utils/auth';
import logo from '../assets/logo_transbg.png';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Submitting login for:', credentials);
      const response = await apiService.login(credentials);
      console.log(response);
      // Handle nested response structure
      if (response.success && response.data && response.data.token) {
        auth.setToken(response.data.token);
        auth.setUser({
          userId: response.data.userId,
          email: response.data.email,
          userName: response.data.userName,
          displayName: response.data.displayName,
          userRole: response.data.userRole,
          profilePicture: response.data.profilePicture,
          userType: response.data.userType
        });
        navigate('/dashboard');
      } else {
        setError(response.message || 'Invalid response from server');
      }
    } catch (err) {
      setError(err || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Implement Google OAuth here
    console.log('Google sign-in clicked');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Section */}
      <div className="flex-1 flex flex-col p-6 md:p-10 bg-white">
        {/* Logo */}
        <div className="mb-8 md:mb-12">
          <img src={logo} alt="Clientalio" className="h-12 md:h-16 w-auto" />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Google Sign In */}
            <button 
              type="button" 
              className="btn btn-google w-full mb-5" 
              onClick={handleGoogleSignIn}
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path fill="#4285F4" d="M19.6 10.23c0-.82-.07-1.43-.22-2.05H10v3.72h5.5c-.11.94-.68 2.35-1.97 3.3l-.02.13 2.87 2.22.2.02c1.82-1.68 2.87-4.15 2.87-7.08z"/>
                <path fill="#34A853" d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.05-2.37c-.83.56-1.9.94-3.57.94-2.74 0-5.06-1.79-5.89-4.25l-.12.01-2.99 2.31-.04.11C2.62 17.47 6.03 20 10 20z"/>
                <path fill="#FBBC05" d="M4.11 11.9c-.21-.62-.33-1.29-.33-1.97s.12-1.35.32-1.97l-.01-.14-3.02-2.35-.1.05C.35 7.36 0 8.63 0 10s.35 2.64.97 3.83l3.14-2.43z"/>
                <path fill="#EB4335" d="M10 3.88c1.93 0 3.23.84 3.97 1.54l2.97-2.9C15.95.99 13.7 0 10 0 6.03 0 2.62 2.53.97 6.17l3.14 2.43C4.94 5.67 7.26 3.88 10 3.88z"/>
              </svg>
              Sign in as Ravi
            </button>

            {/* Divider */}
            <div className="relative text-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <span className="relative bg-white px-4 text-sm text-gray-500">Or with Email</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="error-message">{error}</div>}

              <div className="input-group">
                <label htmlFor="email">Email or Username</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="Enter your email"
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </div>

              <div className="text-right mb-6">
                <a href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full py-3.5 text-base font-bold tracking-wide"
                disabled={loading}
              >
                {loading ? <span className="loading"></span> : 'SIGN IN'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6 text-gray-600">
              New to Clientalio? <a href="/signup" className="text-primary font-semibold hover:underline">Sign Up!</a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs md:text-sm leading-relaxed mt-10">
          © 2025 <a href="https://clientalio.com" className="text-primary hover:underline">Clientalio</a> All rights reserved.<br />
          Developed with ❤️ in India by <a href="#" className="text-primary hover:underline">BWays Techno Solution</a>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-50 to-red-50 items-center justify-center p-10 relative overflow-hidden" 
           style={{backgroundImage: 'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center max-w-lg">
          <h2 className="text-5xl font-bold text-gray-800 mb-5">Welcome back!</h2>
          <p className="text-2xl text-primary font-semibold leading-relaxed">
            Join us to collect testimonials from your clients and get noticed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
