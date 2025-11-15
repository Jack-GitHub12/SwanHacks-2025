import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
  theme?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  animated = true, 
  showText = true,
  theme = 'light'
}) => {
  const sizeMap = {
    sm: { icon: 6, fontSize: 'lg', subtitle: 'xs' },
    md: { icon: 9, fontSize: '2xl', subtitle: 'xs' },
    lg: { icon: 12, fontSize: '3xl', subtitle: 'sm' },
    xl: { icon: 16, fontSize: '4xl', subtitle: 'md' },
  };

  const themeColors = {
    light: {
      text: 'gray.900',
      icon: 'primary.600',
      subtitle: 'gray.500',
    },
    dark: {
      text: 'white',
      icon: 'white',
      subtitle: 'gray.400',
    },
  };

  const IconBox = (
    <Box position="relative">
      <Box
        position="absolute"
        inset={0}
        borderRadius="lg"
        filter="blur(8px)"
        opacity={0.2}
        transition="opacity 0.3s"
        className={`bg-gradient-to-br ${theme === 'light' ? 'from-primary-600 to-secondary-600' : 'from-primary-400 to-secondary-400'} group-hover:opacity-40`}
      />
      
      <Box
        position="relative"
        w={sizeMap[size].icon}
        h={sizeMap[size].icon}
        color={themeColors[theme].icon}
        className="drop-shadow-lg"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2V2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <line x1="8" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
      </Box>
    </Box>
  );

  return (
    <Flex align="center" gap={3}>
      {animated ? (
        <motion.div
          style={{ position: 'relative' }}
          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          {IconBox}
        </motion.div>
      ) : (
        IconBox
      )}
      
      {showText && (
        <Flex direction="column">
          <Heading
            as="h1"
            fontSize={sizeMap[size].fontSize}
            fontWeight="bold"
            color={themeColors[theme].text}
            lineHeight={1}
          >
            Bookster
          </Heading>
          {size !== 'sm' && (
            <Text
              fontSize={sizeMap[size].subtitle}
              color={themeColors[theme].subtitle}
              fontWeight="medium"
              letterSpacing="wide"
            >
              ISU Marketplace
            </Text>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default Logo;
