import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { auth } from '../utils/auth';
import { getClientInfo } from '../utils/geolocation';
import logo from '../assets/logo_transbg.png';
import Footer from './Footer';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Initialize Google Sign-In after script loads
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '484877265494-112l66sk82fd08jatir3h16dtgn45d9u.apps.googleusercontent.com',
          callback: handleCredentialResponse,
        });
        
        // Render the Google Sign-In button
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          { 
            theme: 'outline', 
            size: 'large',
            width: '100%',
            text: 'signin_with',
          }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Define callback function
  const handleCredentialResponse = async (response) => {
    try {
      setLoading(true);
      setError('');
      
      // Get client info (IP address, location, etc.)
      const clientInfo = await getClientInfo();
      
      // Send the credential to your backend
      const result = await apiService.googleSignIn({ credential: response.credential }, clientInfo);
      
      if (result.success && result.data && result.data.token) {
        auth.setToken(result.data.token);
        auth.setUser({
          userId: result.data.userId,
          email: result.data.email,
          userName: result.data.userName,
          displayName: result.data.displayName,
          userRole: result.data.userRole,
          profilePicture: result.data.profilePicture,
          userType: result.data.userType
        });
        navigate('/dashboard');
      } else {
        setError(result.message || 'Google sign-in failed');
      }
    } catch (err) {
      setError(err || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <div id="googleSignInButton" className="w-full mb-5"></div>

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
        <Footer />
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
