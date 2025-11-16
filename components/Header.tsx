import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Flex, Button, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';

interface HeaderProps {
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ subtitle = 'Your Campus Textbook Marketplace' }) => {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Debug logging
  React.useEffect(() => {
    console.log('[Header] Render state - User:', user?.email, 'Profile:', profile?.display_name);
    console.log('[Header] Should show profile menu:', !!user);
  }, [user, profile]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/landing';
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass-enhanced border-b border-gray-200/50 rounded-b-2xl mx-4 mt-4"
    >
      <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }} py={5}>
        <Flex align="center" justify="space-between">
          <Link href="/" className="group">
            <Logo size="md" theme="light" showText={true} animated={true} />
          </Link>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Flex align="center" gap={3}>
              <Link href="/marketplace">
                <motion.button
                  className="btn btn-secondary text-sm px-3 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box as="span" display={{ base: 'none', sm: 'inline' }}>Marketplace</Box>
                  <Box as="span" display={{ base: 'inline', sm: 'none' }}>🛒</Box>
                </motion.button>
              </Link>
              <Link href="/events">
                <motion.button
                  className="btn btn-secondary text-sm px-3 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box as="span" display={{ base: 'none', sm: 'inline' }}>Events</Box>
                  <Box as="span" display={{ base: 'inline', sm: 'none' }}>📅</Box>
                </motion.button>
              </Link>
              <Link href="/discussions">
                <motion.button
                  className="btn btn-secondary text-sm px-3 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box as="span" display={{ base: 'none', sm: 'inline' }}>Discussions</Box>
                  <Box as="span" display={{ base: 'inline', sm: 'none' }}>💬</Box>
                </motion.button>
              </Link>
              <Link href="/post">
                <motion.button
                  className="btn btn-primary text-sm px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box as="span" display={{ base: 'none', sm: 'inline' }}>Post Item</Box>
                  <Box as="span" display={{ base: 'inline', sm: 'none' }}>Post</Box>
                </motion.button>
              </Link>

              {user && (
                <Box position="relative">
                  <motion.button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-100 hover:bg-primary-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Box
                      w={8}
                      h={8}
                      borderRadius="full"
                      overflow="hidden"
                      border="2px solid"
                      borderColor="primary.300"
                      className="bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold text-sm"
                    >
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.innerText = user.email?.[0].toUpperCase() || 'U';
                          }}
                        />
                      ) : (
                        user.email?.[0].toUpperCase()
                      )}
                    </Box>
                    <svg className="w-4 h-4 text-primary-600" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>

                  <AnimatePresence>
                    {showDropdown && (
                      <>
                        <Box
                          position="fixed"
                          inset={0}
                          zIndex={10}
                          onClick={() => setShowDropdown(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20"
                        >
                          <Box px={4} py={3} borderBottom="1px solid" borderColor="gray.100">
                            <Text fontSize="sm" fontWeight="semibold" color="gray.900" className="truncate">
                              {user.email}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              Iowa State Student
                            </Text>
                          </Box>
                          
                          <Button
                            onClick={() => router.push('/profile')}
                            w="full"
                            px={4}
                            py={2}
                            textAlign="left"
                            fontSize="sm"
                            color="gray.700"
                            _hover={{ bg: 'gray.50' }}
                            variant="ghost"
                            justifyContent="flex-start"
                            gap={2}
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Edit Profile
                          </Button>
                          
                          <Button
                            onClick={handleSignOut}
                            w="full"
                            px={4}
                            py={2}
                            textAlign="left"
                            fontSize="sm"
                            color="red.600"
                            _hover={{ bg: 'red.50' }}
                            variant="ghost"
                            justifyContent="flex-start"
                            gap={2}
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Sign Out
                          </Button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </Box>
              )}
            </Flex>
          </motion.div>
        </Flex>
      </Box>
    </motion.header>
  );
};

export default Header;
