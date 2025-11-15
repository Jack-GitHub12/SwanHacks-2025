import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface FeatureIconProps {
  icon: 'lightning' | 'ai' | 'money' | 'shield' | 'mobile' | 'search';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const MotionBox = motion(Box);

const FeatureIcon: React.FC<FeatureIconProps> = ({ icon, size = 'md', animated = true }) => {
  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const icons = {
    lightning: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="url(#lightning-gradient)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="lightning-gradient" x1="3" y1="2" x2="13" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FBBF24" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>
    ),
    ai: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" fill="url(#ai-gradient)" />
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="ai-gradient" x1="9" y1="9" x2="15" y2="15" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
    ),
    money: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="url(#money-gradient)" />
        <path d="M12 6v12M9 9h3.5a1.5 1.5 0 010 3H9m3.5 0H15a1.5 1.5 0 010 3H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="money-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10B981" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" fill="url(#shield-gradient)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="shield-gradient" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
      </svg>
    ),
    mobile: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="url(#mobile-gradient)"/>
        <path d="M12 18h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <defs>
          <linearGradient id="mobile-gradient" x1="5" y1="2" x2="19" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06B6D4" />
            <stop offset="1" stopColor="#0891B2" />
          </linearGradient>
        </defs>
      </svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="url(#search-gradient)"/>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="11" cy="11" r="3" fill="white" fillOpacity="0.3"/>
        <defs>
          <linearGradient id="search-gradient" x1="3" y1="3" x2="19" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    ),
  };

  const Wrapper = animated ? MotionBox : Box;
  const wrapperAnimationProps = animated ? {
    whileHover: { scale: 1.1, rotate: [0, -5, 5, 0] },
    transition: { duration: 0.3 }
  } : {};

  return (
    <Wrapper
      w={sizes[size]}
      h={sizes[size]}
      position="relative"
      role="group"
      {...wrapperAnimationProps}
    >
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-br, primary.500/20, secondary.500/20)"
        borderRadius="xl"
        filter="blur(4px)"
        _groupHover={{ filter: 'blur(6px)' }}
        transition="filter 0.3s"
      />
      <Box position="relative" w="full" h="full">
        {icons[icon]}
      </Box>
    </Wrapper>
  );
};

export default FeatureIcon;

