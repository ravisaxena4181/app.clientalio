import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import { auth } from '../utils/auth';
import { getClientInfo } from '../utils/geolocation';

const GoogleSignInCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleGoogleCallback = async () => {
        console.log('Handling Google Sign-In callback');

      try {
        // Get the credential from URL hash or query parameters
        const params = new URLSearchParams(location.hash.replace('#', '?'));
        const credential = params.get('id_token') || params.get('credential');
        console.log('Received credential:', credential);
        if (!credential) {
          // Check query params as fallback
          const queryParams = new URLSearchParams(location.search);
          const queryCredential = queryParams.get('credential') || queryParams.get('id_token');
          
          if (!queryCredential) {
            console.log('No credential found in URL');
            setError('No credential found in URL');
            setTimeout(() => navigate('/login'), 2000);
            return;
          }
        }

        // Verify token with Google's tokeninfo endpoint
        const verifyResponse = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
        );
        
        if (!verifyResponse.ok) {
            console.log('Token verification failed');
            throw new Error('Token verification failed');
        }

        const tokenInfo = await verifyResponse.json();
        
        // Validate token
        if (tokenInfo.aud !== '484877265494-112l66sk82fd08jatir3h16dtgn45d9u.apps.googleusercontent.com') {
            console.log('Invalid token audience');
            throw new Error('Invalid token audience');
        }

        // Get client info (IP, location, timezone)
        const clientInfo = await getClientInfo();

        // Call googleSignIn API
        const result = await apiService.googleSignIn({ credential }, clientInfo);
        console.log('Google Sign-In API result:', result);
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
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        console.error('Google sign-in error:', err);
        setError(err.message || 'Google sign-in failed. Please try again.');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleGoogleCallback();
  }, [location]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Processing Google Sign-In...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleSignInCallback;
