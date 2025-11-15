import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import FeatureIcon from '@/components/FeatureIcon';

export default function Landing() {
  const features = [
    {
      icon: 'lightning' as const,
      title: 'Lightning Fast',
      description: 'Post your item in 30 seconds. Find what you need instantly.',
    },
    {
      icon: 'ai' as const,
      title: 'AI-Powered',
      description: 'Smart descriptions and fair price suggestions powered by Google Gemini.',
    },
    {
      icon: 'money' as const,
      title: 'Save Money',
      description: 'Better prices than campus bookstores. Buy and sell directly with students.',
    },
    {
      icon: 'shield' as const,
      title: 'Safe & Secure',
      description: 'ISU email verification. Contact info hidden until you\'re ready.',
    },
    {
      icon: 'mobile' as const,
      title: 'Mobile Friendly',
      description: 'Works perfectly on any device. Browse and post from anywhere.',
    },
    {
      icon: 'search' as const,
      title: 'Smart Search',
      description: 'Find exactly what you need with powerful filtering and search.',
    },
  ];

  return (
    <>
      <Head>
        <title>Bookster - Iowa State Student Community & Marketplace</title>
        <meta name="description" content="Connect with Iowa State students. Trade items, join discussions, discover events. AI-powered community platform with marketplace features." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Bookster - Iowa State Student Community & Marketplace" />
        <meta property="og:description" content="The complete community platform for Iowa State students. Trade items, discuss topics, and discover campus events." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900 relative">
        {/* Subtle grain texture overlay */}
        <div className="fixed inset-0 bg-noise opacity-[0.015] pointer-events-none"></div>
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-4 left-4 right-4 z-50 glass-dark border border-white/10 rounded-2xl shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Logo size="md" theme="dark" showText={true} animated={true} />
              
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <motion.button
                    className="btn-glass text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/signup">
                  <motion.button
                    className="btn-gradient"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            {/* Floating decorative elements */}
            <motion.div
              className="absolute top-20 right-20 w-20 h-20 border-2 border-primary-400/30 rounded-lg"
              animate={{
                y: [0, -30, 0],
                rotate: [0, 45, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-40 left-20 w-16 h-16 border-2 border-secondary-400/30 rounded-full"
              animate={{
                y: [0, 30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-lg"
              animate={{
                y: [0, -20, 0],
                x: [0, 20, 0],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="max-w-7xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
              >
                <span className="text-xs font-semibold text-white">For Iowa State Students</span>
                <span className="px-2 py-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-xs font-bold text-white">
                  AI-Powered
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.3,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
              >
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="inline-block"
                >
                  ISU Student Community
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.6,
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="inline-block bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent animate-gradient"
                >
                  & Marketplace
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.8,
                  duration: 0.6,
                  ease: "easeOut"
                }}
                className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
              >
                {['Trade items & connect.', 'AI-powered listings.', 'Community discussions.', 'Campus events.'].map((text, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
                    className="inline-block mr-2"
                  >
                    {text}
                  </motion.span>
                ))}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href="/signup">
                  <motion.button
                    className="group relative btn-gradient text-lg px-8 py-4 shadow-2xl overflow-hidden"
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(200, 16, 46, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center">
                      Get Started Free
                      <motion.svg 
                        className="w-5 h-5 ml-2 inline" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </motion.button>
                </Link>
                <Link href="/browse">
                  <motion.button
                    className="btn-glass-large text-white text-lg px-8 py-4 relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">Browse Listings</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400 text-sm"
              >
                {['Join Now', 'Free Forever', 'AI-Powered'].map((text, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 + i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
                  >
                    <motion.svg 
                      className="w-5 h-5 text-green-400" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.7 + i * 0.1, duration: 0.5 }}
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                    <span>{text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-4xl sm:text-5xl font-bold text-white mb-4"
              >
                {'Everything You Need'.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="inline-block mr-3"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl text-gray-400 max-w-2xl mx-auto"
              >
                A complete platform designed specifically for Iowa State students
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="feature-card group"
                >
                  <div className="mb-4">
                    <FeatureIcon icon={feature.icon} size="lg" animated={true} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-4xl sm:text-5xl font-bold text-white mb-4"
              >
                How It Works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl text-gray-400"
              >
                Get started in three simple steps
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  step: '1',
                  title: 'Sign Up',
                  description: 'Quick signup with Google - no ISU email required',
                },
                {
                  step: '2',
                  title: 'Explore & Engage',
                  description: 'Trade items, join discussions, discover campus events',
                },
                {
                  step: '3',
                  title: 'Connect & Thrive',
                  description: 'Build connections with fellow Cyclones in your community',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + index * 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-2xl"
                  >
                    {item.step}
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
                    className="text-2xl font-bold text-white mb-3"
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.2, duration: 0.5 }}
                    className="text-gray-400"
                  >
                    {item.description}
                  </motion.p>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 -right-6 text-gray-600 text-4xl">
                      →
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center relative"
          >
            {/* Glass card with gradient border */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl p-12 shadow-2xl backdrop-blur-xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-4xl sm:text-5xl font-bold text-white mb-6"
              >
                {['Join', 'the', 'Cyclone', 'Community'].map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="inline-block mr-3"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl text-white/90 mb-8"
              >
                Connect, trade, and engage with fellow Iowa State students
              </motion.p>
              <Link href="/signup">
                <motion.button
                  className="bg-white text-primary-600 font-bold text-lg px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            {/* Tech Stack Badges */}
            <div className="mb-8">
              <p className="text-center text-gray-500 text-xs uppercase tracking-wide mb-4">Built With</p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {/* Next.js Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.0968-.0638c.8597-.5691 1.7675-1.3633 2.4816-2.1708 1.5514-1.7551 2.568-3.8558 3.0247-6.2502.0961-.659.108-.8537.108-1.7475s-.012-1.0884-.108-1.7476c-.652-4.506-3.8591-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.42-2.4985-.5232-.169-.0176-1.0835-.0366-1.6123-.037zm4.0685 7.217c.3473 0 .4082.0053.4857.047.1127.0562.204.1642.237.2767.0186.061.0234 1.3653.0186 4.3044l-.0067 4.2175-.7436-1.14-.7461-1.14v-3.066c0-1.982.0093-3.0963.0234-3.1502.0375-.1313.1196-.2346.2323-.2955.0961-.0494.1313-.054.4997-.054z"/>
                  </svg>
                  <span className="text-white text-sm font-medium">Next.js</span>
                </div>

                {/* Supabase Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <path d="M12.955 3.567c-1.074-1.425-3.377-.816-3.377 1.126V16.74L3.956 21.48c-1.074.938-.277 2.681 1.177 2.569l16.333-1.265c1.454-.112 2.14-1.83 1.013-2.535l-7.524-4.682V3.567z"/>
                  </svg>
                  <span className="text-white text-sm font-medium">Supabase</span>
                </div>

                {/* TypeScript Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3178C6">
                    <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
                  </svg>
                  <span className="text-white text-sm font-medium">TypeScript</span>
                </div>

                {/* Tailwind Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#06B6D4">
                    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
                  </svg>
                  <span className="text-white text-sm font-medium">Tailwind</span>
                </div>

                {/* Chakra UI Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm3.263 16.947l-1.87-4.674-4.674-1.87c-.34-.136-.34-.64 0-.776l4.674-1.87 1.87-4.674c.136-.34.64-.34.776 0l1.87 4.674 4.674 1.87c.34.136.34.64 0 .776l-4.674 1.87-1.87 4.674c-.136.34-.64.34-.776 0z" fill="#319795"/>
                    <circle cx="12" cy="12" r="3" fill="#4FD1C5"/>
                  </svg>
                  <span className="text-white text-sm font-medium">Chakra UI</span>
                </div>

                {/* OpenRouter Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="openrouter-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V7l-10-5z" fill="url(#openrouter-gradient)" opacity="0.2" stroke="url(#openrouter-gradient)" strokeWidth="1.5"/>
                    <path d="M12 8v8m-4-4h8" stroke="url(#openrouter-gradient)" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="2" fill="url(#openrouter-gradient)"/>
                    <path d="M8 8l8 8M16 8l-8 8" stroke="url(#openrouter-gradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
                  </svg>
                  <span className="text-white text-sm font-medium">OpenRouter</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
              <Logo size="sm" theme="dark" showText={true} animated={false} />
              <div className="text-gray-400 text-sm">
                © 2025 Bookster. Made for ISU students
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
}

