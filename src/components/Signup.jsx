import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { getClientInfo } from '../utils/geolocation';
import logo from '../assets/logo_transbg.png';
import Footer from './Footer';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
        console.log('Client Info:', clientInfo);
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

    if (!agreedToTerms) {
      setError('Please agree to the Terms and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      // Get client IP and location info
      const clientInfo = await getClientInfo();

      // Prepare registration data matching API requirements
      const registrationData = {
        Email: email,
        Password: null,
        usertype:  "customer",
        loginsource: 0,
        loginreference: null,
        name: null,
        surname: null,
        displayname: null,
        profilepic: null,
        customertimezone: clientInfo.timezone,
        GToken: "",
        IPAddress: clientInfo.ip,
        CustomerLocation: clientInfo.city && clientInfo.country 
          ? `${clientInfo.city}, ${clientInfo.country}` 
          : clientInfo.country || null,
        CountryId: clientInfo.countryCode || null,
      };

      const response = await apiService.registerEmail(registrationData);
      console.log(response);
      if (response.success) {
        // Redirect to OTP verification page
        navigate('/verify', { state: { email: email } });
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign-in clicked');
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
      {/* Left Section - Signup Form */}
      <div className="flex-1 flex flex-col p-6 md:p-10 bg-white">
        {/* Logo */}
        <div className="mb-8 md:mb-12">
          <img src={logo} alt="Clientalio" className="h-12 md:h-16 w-auto" />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign up</h2>

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

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="/terms" className="text-primary hover:underline">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full py-3.5 text-base font-bold tracking-wide"
                disabled={loading}
              >
                {loading ? <span className="loading"></span> : 'CREATE ACCOUNT'}
              </button>
            </form>

            {/* Already have account */}
            <div className="text-center mt-6 text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-primary font-semibold hover:underline">
                Sign in!
              </a>
            </div>

            {/* Divider */}
            <div className="relative text-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <span className="relative bg-white px-4 text-sm text-gray-500">Or</span>
            </div>

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
          </div>
        </div>

        {/* Footer */}
        <Footer />
        {ipInfo && (
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-2">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>IP: {ipInfo.ip || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>
                {ipInfo.city && ipInfo.country 
                  ? `${ipInfo.city}, ${ipInfo.country}` 
                  : ipInfo.country || 'Unknown location'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right Section - Welcome Message */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-50 to-red-50 items-center justify-center p-10 relative overflow-hidden" 
           style={{backgroundImage: 'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center max-w-lg bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-5">Welcome back!</h2>
          <p className="text-2xl text-primary font-semibold leading-relaxed">
            Join us to collect testimonials from your clients and get noticed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
