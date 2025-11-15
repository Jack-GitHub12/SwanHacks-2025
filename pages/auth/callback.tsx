import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let redirected = false;

    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        // Check for errors in URL
        const queryParams = new URLSearchParams(window.location.search);
        const error_code = queryParams.get('error');
        const error_description = queryParams.get('error_description');

        if (error_code) {
          console.error('OAuth error:', error_code, error_description);
          setError(error_description || 'Authentication failed. Please try again.');
          setTimeout(() => {
            if (!redirected) {
              redirected = true;
              window.location.href = '/login?error=auth_failed';
            }
          }, 2000);
          return;
        }

        console.log('Waiting for authentication to complete...');

        // Wait a bit for Supabase to automatically handle the PKCE code exchange
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Authentication failed. Please try again.');
          setTimeout(() => {
            if (!redirected) {
              redirected = true;
              window.location.href = '/login?error=auth_failed';
            }
          }, 2000);
          return;
        }

        if (session?.user) {
          console.log('Auth successful! User:', session.user.email);
          console.log('Redirecting to home page...');
          
          // Ensure redirect happens
          if (!redirected) {
            redirected = true;
            window.location.href = '/';
          }
        } else {
          console.log('No session found, redirecting to login');
          setTimeout(() => {
            if (!redirected) {
              redirected = true;
              window.location.href = '/login';
            }
          }, 1000);
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('An unexpected error occurred.');
        setTimeout(() => {
          if (!redirected) {
            redirected = true;
            window.location.href = '/login?error=auth_failed';
          }
        }, 2000);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      handleCallback();
    }

    // Cleanup to prevent redirect after unmount
    return () => {
      redirected = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900 flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-400 text-xl mb-4">⚠️</div>
            <p className="text-white text-lg">{error}</p>
            <p className="text-gray-400 text-sm mt-2">Redirecting...</p>
          </>
        ) : (
          <>
            <div className="spinner w-12 h-12 border-white mx-auto mb-4" />
            <p className="text-white text-lg">Completing sign in...</p>
          </>
        )}
      </div>
    </div>
  );
}

