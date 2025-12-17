import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import { auth } from '../utils/auth';
import logo from '../assets/logo_transbg.png';
import Footer from './Footer';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(210); // 3:30 minutes in seconds
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.verifyOTP({
        Email: email,
        OTP: otpCode,
      });
      console.log('VerifyOTP response:', response.data);
      
      if (response.success) {
        // Auto login with temporary password from OTP verification
        if (response.data.email && response.data.password) {
          await AutoLoginCustomer(response.data.email, response.data.password);
        } else {
          setError('Missing credentials for auto-login');
        }
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err) {
      setError(err || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const AutoLoginCustomer = async (email, password) => {
    try {
      const loginResponse = await apiService.login({
        email: email,
        password: password,
        usertype: "customer"
      });
      
      console.log('Auto-login response:', loginResponse);
      
      // Handle nested response structure (same as Login.jsx)
      if (loginResponse.success && loginResponse.data && loginResponse.data.token) {
        auth.setToken(loginResponse.data.token);
        auth.setUser({
          userId: loginResponse.data.userId,
          email: loginResponse.data.email,
          userName: loginResponse.data.userName,
          displayName: loginResponse.data.displayName,
          userRole: loginResponse.data.userRole,
          profilePicture: loginResponse.data.profilePicture,
          userType: loginResponse.data.userType
        });
        
        // Redirect to onboarding to complete profile setup
        navigate('/onboarding', { 
          state: { 
            email: loginResponse.data.email,
            userId: loginResponse.data.userId
          } 
        });
      } else {
        setError('Auto-login failed. Please login manually.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Auto-login error:', err);
      setError('Auto-login failed. Please login manually.');
      navigate('/login');
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await apiService.registerEmail({
        email: email,
        signupSource: "Email"
      });
      if (response.success) {
        setTimeLeft(210);
        setOtp(['', '', '', '']);
        // Show success message
      } else {
        setError(response.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError(err || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign-in clicked');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Clientalio" className="h-16 w-auto" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Email Verification</h2>
          
          {/* Phone Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 11h6M9 14h3" />
              </svg>
            </div>
          </div>

          <p className="text-gray-600 mb-2">Enter the verification code we sent to your email id</p>
          <p className="text-gray-900 font-medium">{email}</p>
        </div>

        {/* OTP Input */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="error-message">{error}</div>}

          <div className="flex justify-center gap-4 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-16 h-16 text-center text-3xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            ))}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full py-3.5 text-base font-bold"
            disabled={loading || otp.some(d => !d)}
          >
            {loading ? <span className="loading"></span> : 'VERIFY'}
          </button>
        </form>

        {/* Timer and Resend */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 mb-2">
            OTP will be expired in {formatTime(timeLeft)} minutes
          </p>
          <button
            onClick={handleResendOTP}
            disabled={loading}
            className="text-sm text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Didn't get the code?{' '}
            <span className="text-primary font-semibold">Resend it</span>
          </button>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default VerifyOTP;
