import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { AuthProvider } from '@/contexts/AuthContext';
import { system } from '@/theme/system';

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <ChakraProvider value={system}>
      <AuthProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23C8102E'/><rect x='20' y='30' width='50' height='60' fill='white' rx='2'/><rect x='25' y='35' width='40' height='3' fill='%23C8102E'/><rect x='25' y='45' width='40' height='3' fill='%23C8102E'/><rect x='25' y='55' width='40' height='3' fill='%23C8102E'/></svg>" />
        </Head>
        
        {/* Parallax background */}
        <div className="parallax-bg" />
        
        <AnimatePresence mode="wait" initial={false}>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </AuthProvider>
    </ChakraProvider>
  );
}

