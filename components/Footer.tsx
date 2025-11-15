import React from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface FooterProps {
  onSafetyClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onSafetyClick }) => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white border-t border-gray-200 mt-auto"
    >
      <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }} py={8}>
        <Flex direction={{ base: 'column', sm: 'row' }} align="center" justify="space-between" gap={4}>
          <Text fontSize="sm" color="gray.600">
            © 2025 Bookster | Made for students, by students
          </Text>
          <Flex gap={6}>
            {onSafetyClick && (
              <motion.button
                onClick={onSafetyClick}
                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Safety Tips
              </motion.button>
            )}
          </Flex>
        </Flex>
      </Box>
    </motion.footer>
  );
};

export default Footer;
