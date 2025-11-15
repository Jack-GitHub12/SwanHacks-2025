import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        // Get the current session after OAuth redirect
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          router.push('/login?error=auth_failed');
          return;
        }

        if (session?.user) {
          // Validate email domain for OAuth sign-ins
          const email = session.user.email;
          const provider = session.user.app_metadata?.provider;

          // If signing in with Google and not an Iowa State or Gmail email, sign out and redirect
          if (provider === 'google' && email && !email.endsWith('@iastate.edu') && !email.endsWith('@gmail.com')) {
            await supabase.auth.signOut();
            router.push('/login?error=invalid_email');
            return;
          }

          // Successfully authenticated, redirect to home
          router.push('/');
        } else {
          // No session found, redirect to login
          router.push('/login');
        }
      } catch (err) {
        console.error('Callback error:', err);
        router.push('/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900 flex items-center justify-center">
      <div className="text-center">
        <div className="spinner w-12 h-12 border-white mx-auto mb-4" />
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  );
}

