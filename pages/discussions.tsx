import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Flex, Heading, Text, Button, Input } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DiscussionCard from '@/components/DiscussionCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, DEMO_MODE } from '@/lib/supabase';
import { getDemoDiscussions } from '@/lib/demoStorage';
import { DISCUSSION_CATEGORIES } from '@/lib/discussions';
import type { Discussion } from '@/types/discussions';

// Demo discussions data
const DEMO_DISCUSSIONS: Discussion[] = [
  {
    id: '1',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    user_id: '1',
    title: 'ISU Cycling Club - New Members Welcome!',
    content: 'Hey everyone! The ISU Cycling Club is looking for new members. We ride every weekend and do social events. All skill levels welcome!',
    category: 'clubs',
    status: 'pinned',
    views: 124,
    reply_count: 8,
    author_username: 'cyclist',
    author_name: 'ISU Cyclist',
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    user_id: '2',
    title: 'VEISHEA Alternative Events This Weekend',
    content: 'Looking forward to the alternative events this weekend! Anyone know the schedule?',
    category: 'events',
    status: 'active',
    views: 89,
    reply_count: 12,
    author_username: 'student1',
    author_name: 'Event Enthusiast',
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 10800000).toISOString(),
    updated_at: new Date(Date.now() - 5400000).toISOString(),
    user_id: '3',
    title: 'Looking for CS 228 Study Group',
    content: 'Anyone want to form a study group for CS 228? Meeting at Parks Library on Tuesdays and Thursdays.',
    category: 'study-groups',
    status: 'active',
    views: 56,
    reply_count: 5,
    author_username: 'cs_student',
    author_name: 'CS Major',
  },
  {
    id: '4',
    created_at: new Date(Date.now() - 14400000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    user_id: '4',
    title: 'Roommate Needed for Spring Semester',
    content: 'Looking for a roommate for my 2BR apartment near campus. $450/month + utilities. Message me!',
    category: 'housing',
    status: 'active',
    views: 78,
    reply_count: 3,
    author_username: 'housing_seeker',
    author_name: 'Roommate Finder',
  },
  {
    id: '5',
    created_at: new Date(Date.now() - 18000000).toISOString(),
    updated_at: new Date(Date.now() - 9000000).toISOString(),
    user_id: '5',
    title: 'Software Engineering Internship Opportunities',
    content: 'Principal Financial is hiring interns! Great opportunity for CS/CPR E majors. DM me for referral.',
    category: 'jobs',
    status: 'active',
    views: 143,
    reply_count: 15,
    author_username: 'career_helper',
    author_name: 'Career Advisor',
  },
  {
    id: '6',
    created_at: new Date(Date.now() - 21600000).toISOString(),
    updated_at: new Date(Date.now() - 10800000).toISOString(),
    user_id: '6',
    title: 'Best Study Spots on Campus?',
    content: 'Where do you all like to study? Parks Library gets too crowded. Looking for quiet alternatives.',
    category: 'general',
    status: 'active',
    views: 92,
    reply_count: 18,
    author_username: 'studious',
    author_name: 'Study Buddy',
  },
];

export default function Discussions() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load discussions
  useEffect(() => {
    if (user) {
      loadDiscussions();
    }
  }, [user]);

  // Filter discussions
  useEffect(() => {
    filterDiscussions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discussions, selectedCategory, searchQuery]);

  const loadDiscussions = async () => {
    try {
      // INSTANTLY show demo data from session storage (includes user-created discussions!)
      const sessionDiscussions = getDemoDiscussions(DEMO_DISCUSSIONS);
      setDiscussions(sessionDiscussions);
      setLoading(false);
      console.log('Showing demo discussions instantly:', sessionDiscussions.length);

      // Then try to load real data in background
      if (DEMO_MODE) {
        console.log('DEMO_MODE enabled - keeping session demo data');
        return;
      }

      console.log('Attempting to fetch real discussions from Supabase...');
      const { data, error } = await supabase
        .from('discussions_with_user')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Supabase discussions error:', error);
        console.log('Keeping demo data');
        return;
      }

      // Only replace demo data if we got real data
      if (data && data.length > 0) {
        console.log('Real discussions loaded:', data.length);
        setDiscussions(data);
      } else {
        console.log('No real discussions - keeping demo data');
      }
    } catch (error) {
      console.error('Error loading discussions:', error);
      console.log('Keeping demo data');
      // Demo data already showing, so we're good
    }
  };

  const filterDiscussions = () => {
    let filtered = [...discussions];

    if (selectedCategory) {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.title.toLowerCase().includes(query) ||
        d.content.toLowerCase().includes(query)
      );
    }

    setFilteredDiscussions(filtered);
  };

  const handleDiscussionClick = (id: string) => {
    router.push(`/discussions/${id}`);
  };

  if (authLoading) {
    return (
      <Flex minH="100vh" align="center" justify="center" className="bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
        <Box textAlign="center">
          <div className="spinner w-12 h-12 mx-auto mb-4" />
          <Text color="gray.600">Loading...</Text>
        </Box>
      </Flex>
    );
  }

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Discussion Board - Bookster</title>
        <meta name="description" content="Connect with ISU students - find clubs, events, study groups, and more" />
      </Head>

      <Box minH="100vh" display="flex" flexDirection="column" className="bg-gradient-to-br from-gray-50 via-white to-primary-50/20 relative">
        <div className="fixed inset-0 bg-noise opacity-[0.02] pointer-events-none"></div>
        <Header subtitle="Community Discussion Board" />

        {/* Hero Section */}
        <Box className="glass-enhanced border-b border-gray-200/50 rounded-2xl mx-4 my-4 py-8">
          <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="gray.900" mb={2}>
                ISU Community Board
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600" mb={6}>
                Find clubs, events, study groups, housing, jobs, and connect with fellow Cyclones
              </Text>

              {/* Search */}
              <Flex gap={4} mb={6} direction={{ base: 'column', sm: 'row' }}>
                <Box flex={1} position="relative">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search discussions..."
                    className="input-enhanced pl-12"
                    size="lg"
                  />
                </Box>
                <Link href="/discussions/new">
                  <motion.button
                    className="btn btn-primary px-8 py-3 text-base flex items-center gap-2"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    New Discussion
                  </motion.button>
                </Link>
              </Flex>

              {/* Category Filter */}
              <Flex flexWrap="wrap" gap={2}>
                <motion.button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    !selectedCategory
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                      : 'bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-primary-300'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  All Categories
                </motion.button>

                {DISCUSSION_CATEGORIES.map((cat, index) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                      selectedCategory === cat.id
                        ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
                        : 'bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Flex align="center" gap={2}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill={selectedCategory === cat.id ? "white" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d={cat.icon} />
                      </svg>
                      {cat.name}
                    </Flex>
                  </motion.button>
                ))}
              </Flex>
            </motion.div>
          </Box>
        </Box>

        {/* Discussions List */}
        <Box flex={1} py={8}>
          <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
            {/* Results count */}
            <Flex align="center" justify="space-between" mb={6}>
              <Flex align="center" gap={2}>
                <Box w={2} h={2} borderRadius="full" bg="green.500" className="animate-pulse" />
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  {filteredDiscussions.length} discussion{filteredDiscussions.length !== 1 ? 's' : ''}
                </Text>
              </Flex>
            </Flex>

            {loading ? (
              <Flex justify="center" py={20}>
                <Box textAlign="center">
                  <div className="spinner w-12 h-12 mx-auto mb-4" />
                  <Text color="gray.600">Loading discussions...</Text>
                </Box>
              </Flex>
            ) : filteredDiscussions.length === 0 ? (
              <Box textAlign="center" py={20}>
                <Heading as="h2" fontSize="2xl" fontWeight="bold" color="gray.900" mb={2}>
                  No discussions found
                </Heading>
                <Text color="gray.600" mb={6}>
                  Be the first to start a discussion!
                </Text>
                <Link href="/discussions/new">
                  <Button className="btn btn-primary">
                    Create Discussion
                  </Button>
                </Link>
              </Box>
            ) : (
              <Box className="space-y-4">
                {filteredDiscussions.map((discussion, index) => (
                  <DiscussionCard
                    key={discussion.id}
                    discussion={discussion}
                    index={index}
                    onClick={() => handleDiscussionClick(discussion.id)}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Footer />
      </Box>
    </>
  );
}

