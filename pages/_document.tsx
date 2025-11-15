import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://xapazebllxyonzrtrmcj.supabase.co" />
        <link rel="preconnect" href="https://xapazebllxyonzrtrmcj.supabase.co" crossOrigin="anonymous" />
        
        {/* Resource hints for better performance */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Optimize rendering */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#C8102E" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

