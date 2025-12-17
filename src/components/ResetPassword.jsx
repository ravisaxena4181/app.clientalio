import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import logo from '../assets/logo_transbg.png';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const userId = location.state?.userId || '';
  const otp = location.state?.otp || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.resetPassword({
        Id: userId,
        DisplayName: null,
        Email: email,
        Password: password,
        ImageLinkUploaded: null
      });
      
      console.log('ResetPassword response:', response);
      console.log('Using OTP:', response);
      if (response.success) {
        // Show success message
        setSuccess(response.message || 'Password reset successfully!');
        
        // Wait 3 seconds before redirecting to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err || 'Failed to reset password. Please try again.');
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
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Reset Password</h2>
            <p className="text-gray-600 mb-8">
              Create a new password for <strong>{email}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="error-message">{error}</div>}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <div className="input-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full py-3.5 text-base font-bold tracking-wide"
                disabled={loading || success}
              >
                {loading ? <span className="loading"></span> : 'RESET PASSWORD'}
              </button>
            </form>

            {/* Back to Login */}
            <div className="text-center mt-6 text-gray-600">
              Remember your password?{' '}
              <a href="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </a>
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
           style={{backgroundImage: 'url(https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center max-w-lg">
          <h2 className="text-5xl font-bold text-gray-800 mb-5">New Beginning</h2>
          <p className="text-2xl text-primary font-semibold leading-relaxed">
            Set a strong password to secure your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
