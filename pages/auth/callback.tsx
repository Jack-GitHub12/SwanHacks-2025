import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let redirected = false;
    let authSubscription: any = null;

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

        // Listen for auth state changes for instant redirect
        authSubscription = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth event in callback:', event);
          
          if (event === 'SIGNED_IN' && session?.user && !redirected) {
            console.log('Auth successful! User:', session.user.email);
            console.log('Redirecting to home page...');
            redirected = true;
            window.location.href = '/';
          }
        });

        // Also check immediately if we already have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
        }

        if (session?.user && !redirected) {
          console.log('Session already exists! User:', session.user.email);
          console.log('Redirecting to marketplace...');
          redirected = true;
          window.location.href = '/marketplace';
        }

        // Fallback: if no session after 3 seconds, redirect to login
        setTimeout(() => {
          if (!redirected) {
            console.log('Timeout: No session found, redirecting to login');
            redirected = true;
            window.location.href = '/login';
          }
        }, 3000);
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

    // Cleanup
    return () => {
      redirected = true;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
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

