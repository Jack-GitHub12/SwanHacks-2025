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
        // Supabase automatically handles the OAuth callback and exchanges the code
        // We just need to wait for it to complete
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
          const email = session.user.email;
          const provider = session.user.app_metadata?.provider;

          console.log('Auth callback - User:', email, 'Provider:', provider);

          // Successfully authenticated, redirect to home
          console.log('Auth successful, redirecting to home...');
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

