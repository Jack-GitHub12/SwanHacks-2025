import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        // Check for OAuth code/error in URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // If there's an error parameter, handle it
        if (queryParams.get('error') || hashParams.get('error')) {
          console.error('OAuth error:', queryParams.get('error_description') || hashParams.get('error_description'));
          router.push('/login?error=auth_failed');
          return;
        }

        // Exchange the code for a session (Supabase handles this automatically)
        // Wait a bit for the session to be established
        await new Promise(resolve => setTimeout(resolve, 500));

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

          // Wait for the session to be fully stored
          await new Promise(resolve => setTimeout(resolve, 300));

          // Successfully authenticated, redirect to home
          window.location.href = '/';
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

