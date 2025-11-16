import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let redirected = false;
    let authSubscription: any = null;
    let redirectTimer: NodeJS.Timeout | null = null;

    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        console.log('[OAuth Callback] Starting callback handler');
        console.log('[OAuth Callback] Current URL:', window.location.href);

        // IMPORTANT: Clear demo flag since this is OAuth login, not demo login
        console.log('[OAuth Callback] Clearing demo user flag for OAuth login');
        localStorage.removeItem('isDemoUser');

        // Check for errors in URL
        const queryParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error_code = queryParams.get('error') || hashParams.get('error');
        const error_description = queryParams.get('error_description') || hashParams.get('error_description');

        console.log('[OAuth Callback] URL params:', Object.fromEntries(queryParams.entries()));
        console.log('[OAuth Callback] Hash params:', Object.fromEntries(hashParams.entries()));

        if (error_code) {
          console.error('[OAuth Callback] OAuth error:', error_code, error_description);
          setError(error_description || 'Authentication failed. Please try again.');
          redirectTimer = setTimeout(() => {
            if (!redirected) {
              redirected = true;
              window.location.href = '/login?error=auth_failed';
            }
          }, 2000);
          return;
        }

        // Exchange the OAuth code for a session
        console.log('[OAuth Callback] Exchanging code for session...');
        const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);

        if (exchangeError) {
          console.error('[OAuth Callback] Exchange error:', exchangeError);
        } else if (exchangeData?.session) {
          console.log('[OAuth Callback] Successfully exchanged code for session!');
          console.log('[OAuth Callback] User:', exchangeData.session.user.email);
          console.log('[OAuth Callback] Clearing demo profile data');
          localStorage.removeItem('bookster_demo_profile');

          if (!redirected) {
            redirected = true;
            console.log('[OAuth Callback] Waiting 500ms for session to persist...');
            // Brief wait to ensure session is fully stored
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('[OAuth Callback] Redirecting to marketplace...');
            window.location.href = '/marketplace';
            return;
          }
        } else {
          console.log('[OAuth Callback] No session returned from exchange, continuing to fallback methods');
        }

        // Listen for auth state changes as backup
        authSubscription = supabase.auth.onAuthStateChange((event, session) => {
          console.log('[OAuth Callback] Auth event:', event);
          console.log('[OAuth Callback] Session:', session ? 'exists' : 'null');

          if (event === 'SIGNED_IN' && session?.user && !redirected) {
            console.log('[OAuth Callback] SIGNED_IN event! User:', session.user.email);
            redirected = true;
            if (redirectTimer) clearTimeout(redirectTimer);
            window.location.href = '/marketplace';
          }
        });

        // Also check immediately if we already have a session
        console.log('[OAuth Callback] Checking for existing session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('[OAuth Callback] Session error:', sessionError);
        }

        if (session?.user && !redirected) {
          console.log('[OAuth Callback] Session found! User:', session.user.email);
          redirected = true;
          if (redirectTimer) clearTimeout(redirectTimer);
          window.location.href = '/marketplace';
          return;
        }

        // Fallback: if no session after 5 seconds, redirect to login
        console.log('[OAuth Callback] Setting 5s timeout fallback...');
        redirectTimer = setTimeout(() => {
          if (!redirected) {
            console.warn('[OAuth Callback] Timeout: No session found after 5s, redirecting to login');
            redirected = true;
            window.location.href = '/login?error=timeout';
          }
        }, 5000);
      } catch (err) {
        console.error('[OAuth Callback] Unexpected error:', err);
        setError('An unexpected error occurred.');
        redirectTimer = setTimeout(() => {
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
      if (redirectTimer) clearTimeout(redirectTimer);
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

