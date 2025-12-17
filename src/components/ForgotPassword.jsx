import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { getClientInfo } from '../utils/geolocation';
import logo from '../assets/logo_transbg.png';
import Footer from './Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ipInfo, setIpInfo] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const hasFetchedRef = React.useRef(false);

  useEffect(() => {
    // Prevent duplicate API calls in React Strict Mode
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    // Fetch IP and location info when component mounts
    const fetchIpInfo = async () => {
      try {
        const clientInfo = await getClientInfo();
        setIpInfo(clientInfo);
      } catch (err) {
        console.error('Failed to fetch IP info:', err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchIpInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get client IP and location info
      const clientInfo = await getClientInfo();

      // Prepare forgot password data
      const forgotPasswordData = {
        Email: email,
        usertype: "customer",
        IPAddress: clientInfo.ip,
        CustomerLocation: clientInfo.city && clientInfo.country 
          ? `${clientInfo.city}, ${clientInfo.country}` 
          : clientInfo.country || null,
        CountryId: clientInfo.country || null,
      };

      const response = await apiService.forgotPassword(forgotPasswordData);
      console.log(response);
      if (response.success) {
        // Redirect to OTP verification page for password reset
        navigate('/forgot-verify', { state: { email: email } });
      } else {
        setError(response.message || 'Failed to send reset code');
      }
    } catch (err) {
      setError(err || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="loading mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Section - Forgot Password Form */}
      <div className="flex-1 flex flex-col p-6 md:p-10 bg-white">
        {/* Logo */}
        <div className="mb-8 md:mb-12">
          <img src={logo} alt="Clientalio" className="h-12 md:h-16 w-auto" />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Forgot Password</h2>
            <p className="text-gray-600 mb-8">
              Enter your email address and we'll send you a code to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="error-message">{error}</div>}

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full py-3.5 text-base font-bold tracking-wide"
                disabled={loading}
              >
                {loading ? <span className="loading"></span> : 'SEND RESET CODE'}
              </button>
            </form>

            {/* Back to Login */}
            <div className="text-center mt-6 text-gray-600">
              Remember your password?{' '}
              <a href="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </a>
            </div>

            {/* IP and Location Info */}
            {ipInfo && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v.878A2.001 2.001 0 0112.5 16H12v-1a1 1 0 00-1-1H9v-1a1 1 0 00-1-1H6.5a1 1 0 00-1 1v1a1 1 0 01-1 1h-.5A5.981 5.981 0 014 10c0-.65.134-1.27.332-1.973z" clipRule="evenodd" />
                    </svg>
                    <span>{ipInfo.ip}</span>
                  </div>
                  {ipInfo.city && ipInfo.country && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{ipInfo.city}, {ipInfo.country}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-50 to-red-50 items-center justify-center p-10 relative overflow-hidden"
           style={{backgroundImage: 'url(https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center max-w-lg">
          <h2 className="text-5xl font-bold text-gray-800 mb-5">Reset Password</h2>
          <p className="text-2xl text-primary font-semibold leading-relaxed">
            Don't worry! We'll help you recover your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
