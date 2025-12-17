import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import { auth } from '../utils/auth';
import logo from '../assets/logo_transbg.png';
import Footer from './Footer';

const ForgotVerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(210); // 3:30 minutes in seconds
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
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
  }, [email, navigate]);

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
      const response = await apiService.verifyForgotPasswordOTP({
        Email: email,
        OTP: otpCode,
      });
      console.log('VerifyForgotPasswordOTP response:', response);
      
      if (response.success) {
        // Auto login with temporary password from OTP verification
        if (response.data?.email && response.data?.password) {
          await AutoLoginForPasswordReset(
            response.data.email, 
            response.data.password,
            response.data.userId || response.data.id
          );
        } else {
          // Navigate to reset password page with userId from response
          navigate('/reset-password', { 
            state: { 
              email: response.data?.email || email,
              userId: response.data?.userId || response.data?.id,
              otp: otpCode
            } 
          });
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

  const AutoLoginForPasswordReset = async (email, password, userId) => {
    try {
      const loginResponse = await apiService.login({
        email: email,
        password: password,
        usertype: "customer"
      });
      
      console.log('Auto-login for password reset:', loginResponse);
      
      // Handle nested response structure
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
        
        // Redirect to reset password page with token stored
        navigate('/reset-password', { 
          state: { 
            email: loginResponse.data.email,
            userId: loginResponse.data.userId || userId
          } 
        });
      } else {
        setError('Auto-login failed. Please try again.');
      }
    } catch (err) {
      console.error('Auto-login error:', err);
      setError('Auto-login failed. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await apiService.forgotPassword({
        Email: email,
        usertype: "customer"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Verify Code</h2>
            <p className="text-gray-600 mb-8">
              Please enter the 4-digit code sent to <strong>{email}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="error-message">{error}</div>}

              {/* OTP Inputs */}
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Code expires in:{' '}
                  <span className={`font-semibold ${timeLeft < 60 ? 'text-red-500' : 'text-primary'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full py-3.5 text-base font-bold tracking-wide"
                disabled={loading || timeLeft === 0}
              >
                {loading ? <span className="loading"></span> : 'VERIFY CODE'}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOTP}
                  className="text-primary font-semibold hover:underline"
                  disabled={loading || timeLeft > 0}
                >
                  Resend
                </button>
              </p>
            </div>

            {/* Back to Forgot Password */}
            <div className="text-center mt-4">
              <a href="/forgot-password" className="text-sm text-gray-600 hover:text-primary">
                ← Back to Forgot Password
              </a>
            </div>
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
          <h2 className="text-5xl font-bold text-gray-800 mb-5">Almost There!</h2>
          <p className="text-2xl text-primary font-semibold leading-relaxed">
            Just verify the code and reset your password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotVerifyOTP;
