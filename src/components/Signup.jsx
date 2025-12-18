import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { auth } from '../utils/auth';
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
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [buttonRendered, setButtonRendered] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState(null);
  const navigate = useNavigate();
  const hasFetchedRef = React.useRef(false);
  const googleButtonRef = React.useRef(null);
  const buttonRenderedRef = React.useRef(false);
  const recaptchaRef = React.useRef(null);

  // Global reCAPTCHA callbacks
  React.useEffect(() => {
    // Callback when user completes reCAPTCHA
    window.onRecaptchaCallback = (token) => {
      console.log('reCAPTCHA completed:', token);
      setRecaptchaToken(token);
    };

    // Callback when reCAPTCHA script loads
    window.onRecaptchaLoadCallback = () => {
      console.log('reCAPTCHA script loaded - ready to render');
      setRecaptchaLoaded(true);
    };

    return () => {
      delete window.onRecaptchaCallback;
      delete window.onRecaptchaLoadCallback;
    };
  }, []);

  // Define callback function for Google Sign-In
  const handleCredentialResponse = React.useCallback(async (response) => {
    try {
      setLoading(true);
      setError('');

      // Use already fetched client info
      const clientInfo = ipInfo || await getClientInfo();

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
      setError(err?.message || err?.toString() || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate, ipInfo]);

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

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Sign-In script loaded');
      setGoogleLoaded(true);
    };
    document.body.appendChild(script);

    // Load reCAPTCHA script dynamically
    const recaptchaScript = document.createElement('script');
    recaptchaScript.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadCallback&render=explicit';
    recaptchaScript.async = true;
    recaptchaScript.defer = true;
    document.body.appendChild(recaptchaScript);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.body.contains(recaptchaScript)) {
        document.body.removeChild(recaptchaScript);
      }
    };
  }, []);

  // Initialize Google Sign-In when script loads
  useEffect(() => {
    if (googleLoaded && window.google && !buttonRenderedRef.current) {
      console.log('Initializing Google Sign-In');
      try {
        window.google.accounts.id.initialize({
          client_id: '484877265494-112l66sk82fd08jatir3h16dtgn45d9u.apps.googleusercontent.com',
          callback: handleCredentialResponse,
        });
        buttonRenderedRef.current = true;
        setButtonRendered(true);
        console.log('Google Sign-In initialized successfully');
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
      }
    }
  }, [googleLoaded, handleCredentialResponse]);

  // Render reCAPTCHA widget when script is loaded and DOM is ready
  useEffect(() => {
    // Only render for NON-Indian users
    if (!ipInfo || ipInfo.countryCode === 'IN') {
      console.log('reCAPTCHA not required for Indian users');
      return;
    }
    
    if (recaptchaLoaded && window.grecaptcha && window.grecaptcha.render) {
      const container = document.getElementById('recaptcha-container');
      console.log('Attempting to render reCAPTCHA...');
      console.log('Container element:', container);
      console.log('grecaptcha object:', window.grecaptcha);

      if (!container) {
        console.error('reCAPTCHA container not found in DOM');
        return;
      }

      // Check if already rendered (has children)
      if (container.children.length > 0) {
        console.log('reCAPTCHA already rendered, skipping');
        return;
      }

      try {
        const widgetId = window.grecaptcha.render('recaptcha-container', {
          'sitekey': '6Lf4fi8sAAAAAHLv4A51kN1X614s3KQt89qOOIIL',
          'callback': 'onRecaptchaCallback'
        });
        setRecaptchaWidgetId(widgetId);
        console.log('reCAPTCHA widget rendered successfully, widgetId:', widgetId);
      } catch (error) {
        console.error('Error rendering reCAPTCHA:', error);
      }
    }
  }, [recaptchaLoaded, ipInfo]);

  const handleGoogleSignUpClick = () => {
    // Direct OAuth redirect flow (no FedCM restrictions)
    const clientId = '484877265494-112l66sk82fd08jatir3h16dtgn45d9u.apps.googleusercontent.com';
    const redirectUri = `${window.location.origin}/signin-google`;
    const scope = 'openid email profile';
    const nonce = Math.random().toString(36).substring(2);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=${encodeURIComponent(scope)}&nonce=${nonce}&prompt=select_account`;

    console.log('Redirecting to Google OAuth:', redirectUri);
    window.location.href = authUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('Please agree to the Terms and Privacy Policy');
      return;
    }
    // Use already fetched client info
    const clientInfo = ipInfo;

    console.log('reCAPTCHA loaded:',clientInfo.countryCode , recaptchaLoaded, 'widgetId:', recaptchaWidgetId);
    // Validate reCAPTCHA for NON-Indian users
    if (clientInfo.countryCode !== 'IN') {
      if (window.grecaptcha && recaptchaWidgetId !== null) {
        const captchaToken = window.grecaptcha.getResponse(recaptchaWidgetId);
        console.log('reCAPTCHA token:', captchaToken);
        if (!captchaToken) {
          setError('Please complete the reCAPTCHA verification');
          return;
        }
        console.log('reCAPTCHA verified');
      } else {
        setError('reCAPTCHA not loaded. Please refresh the page.');
        return;
      }
    }
    setLoading(true);

    try {
      // Get reCAPTCHA token only for non-Indian users
      const captchaToken = (clientInfo.countryCode !== 'IN' && window.grecaptcha && recaptchaWidgetId !== null)
        ? window.grecaptcha.getResponse(recaptchaWidgetId)
        : null;

      // Prepare registration data matching API requirements
      const registrationData = {
        Email: email,
        Password: null,
        usertype: "customer",
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
        recaptchaToken: captchaToken, // Include reCAPTCHA token for backend verification
      };
      console.log('Registration data:', registrationData);
      const response = await apiService.registerEmail(registrationData);
      console.log(response);
      if (response.success) {
        // Redirect to OTP verification page
        navigate('/verify', { state: { email: email } });
      } else {
        setError(response.message || 'Registration failed');
        // Reset reCAPTCHA on error if it was used
        if (window.grecaptcha && recaptchaWidgetId !== null) {
          window.grecaptcha.reset(recaptchaWidgetId);
        }
      }
    } catch (err) {
      setError(err?.message || err?.toString() || 'Registration failed. Please try again.');
      // Reset reCAPTCHA on error if it was used
      if (window.grecaptcha && recaptchaWidgetId !== null) {
        window.grecaptcha.reset(recaptchaWidgetId);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // This function is no longer needed as the button is auto-rendered
    console.log('Google button clicked');
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

              {/* reCAPTCHA for NON-Indian users only */}
              {ipInfo && ipInfo.countryCode !== 'IN' && (
                <div className="flex justify-center my-4">
                  <div
                    id="recaptcha-container"
                    style={{ minHeight: '78px', minWidth: '304px' }}
                  ></div>
                </div>
              )}

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
              onClick={handleGoogleSignUpClick}
              disabled={!googleLoaded || loading}
              className="w-full mb-5 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!googleLoaded ? (
                <span className="text-sm text-gray-400">Loading Google Sign-In...</span>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Sign up with Google</span>
                </>
              )}
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
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
