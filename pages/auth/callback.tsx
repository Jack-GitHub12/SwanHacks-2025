import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        // Check if we have a code or error in the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);

        const code = queryParams.get('code');
        const error_code = queryParams.get('error');
        const error_description = queryParams.get('error_description');

        // If there's an error in the URL, show it
        if (error_code) {
          console.error('OAuth error:', error_code, error_description);
          setError(error_description || 'Authentication failed. Please try again.');
          setTimeout(() => {
            window.location.href = '/login?error=auth_failed';
          }, 2000);
          return;
        }

        // If there's a code, exchange it for a session
        if (code) {
          console.log('Found authorization code, exchanging for session...');

          // Exchange the code for a session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            setError('Authentication failed. Please try again.');
            setTimeout(() => {
              window.location.href = '/login?error=auth_failed';
            }, 2000);
            return;
          }

          if (data?.session?.user) {
            const email = data.session.user.email;
            const provider = data.session.user.app_metadata?.provider;

            console.log('Auth callback - User:', email, 'Provider:', provider);

            // Successfully authenticated, redirect to home
            console.log('Auth successful, redirecting to home...');
            window.location.href = '/';
            return;
          }
        }

        // If we get here, check if we already have a session (in case of page refresh)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Authentication failed. Please try again.');
          setTimeout(() => {
            window.location.href = '/login?error=auth_failed';
          }, 2000);
          return;
        }

        if (session?.user) {
          console.log('Existing session found, redirecting to home...');
          window.location.href = '/';
        } else {
          // No session found, redirect to login
          console.log('No session found, redirecting to login');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('An unexpected error occurred.');
        setTimeout(() => {
          window.location.href = '/login?error=auth_failed';
        }, 2000);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      handleCallback();
    }
  }, [router]);

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

