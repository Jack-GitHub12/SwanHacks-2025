import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Flex, Heading, Text, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VoteButtons from '@/components/VoteButtons';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, DEMO_MODE } from '@/lib/supabase';
import { generateGoogleCalendarLink, formatEventDateTime, createEventDates } from '@/lib/calendar';
import { formatDate } from '@/lib/utils';
import { sortEvents, getEventTags, getTagColor, formatEventDate } from '@/lib/eventUtils';
import { getDemoDiscussions } from '@/lib/demoStorage';
import type { Discussion, EventSortOption } from '@/types/discussions';

// Demo events data
const DEMO_EVENTS: Discussion[] = [
  // IEEE Events
  {
    id: 'e1',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    user_id: '1',
    title: 'IEEE: Introduction to PCB Design Workshop',
    content: 'Learn the fundamentals of PCB design using Altium Designer! Perfect for electrical and computer engineering students. All skill levels welcome. Pizza will be provided!',
    category: 'events',
    status: 'pinned',
    views: 145,
    reply_count: 12,
    upvotes: 38,
    downvotes: 2,
    vote_score: 36,
    event_date: new Date(Date.now() + 345600000).toISOString().split('T')[0], // 4 days from now
    event_time: '6:00 PM',
    event_end_time: '8:30 PM',
    event_location: 'Coover Hall, Room 2245',
    author_username: 'ieee_president', author_name: 'ISU Student',
  },
  {
    id: 'e2',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    user_id: '2',
    title: 'IEEE Networking Night with Industry Professionals',
    content: 'Meet engineers from John Deere, Rockwell Collins, and Principal Financial! Network, ask questions about internships and careers. Business casual attire recommended.',
    category: 'events',
    status: 'active',
    views: 203,
    reply_count: 18,
    upvotes: 45,
    downvotes: 1,
    vote_score: 44,
    event_date: new Date(Date.now() + 691200000).toISOString().split('T')[0], // 8 days
    event_time: '7:00 PM',
    event_end_time: '9:00 PM',
    event_location: 'Memorial Union, Great Hall',
    author_username: 'ieee_vicepresident', author_name: 'ISU Student',
  },

  // Holiday Events
  {
    id: 'e5',
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date(Date.now() - 216000000).toISOString(),
    user_id: '5',
    title: 'Winter Wonderland - Finals Week De-Stress Fest',
    content: 'Take a break from studying! Hot chocolate bar, cookie decorating, ugly sweater contest, and therapy dogs. Hosted by Residence Hall Association.',
    category: 'events',
    status: 'active',
    views: 234,
    reply_count: 15,
    upvotes: 52,
    downvotes: 3,
    vote_score: 49,
    event_date: new Date(Date.now() + 518400000).toISOString().split('T')[0], // 6 days
    event_time: '3:00 PM',
    event_end_time: '7:00 PM',
    event_location: 'Maple-Willow-Larch Commons',
    author_username: 'rha_events', author_name: 'ISU Student',
  },
  {
    id: 'e6',
    created_at: new Date(Date.now() - 518400000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    user_id: '6',
    title: 'MLK Day Service Event - Community Volunteer Day',
    content: 'Honor MLK Jr. through service! Volunteer opportunities at local food banks, parks cleanup, and tutoring programs. Transportation provided.',
    category: 'events',
    status: 'active',
    views: 189,
    reply_count: 14,
    upvotes: 41,
    downvotes: 2,
    vote_score: 39,
    event_date: new Date(Date.now() + 864000000).toISOString().split('T')[0], // 10 days
    event_time: '9:00 AM',
    event_end_time: '2:00 PM',
    event_location: 'Meet at Memorial Union',
    author_username: 'community_engagement', author_name: 'ISU Student',
  },

  // Dorm Events
  {
    id: 'e7',
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date(Date.now() - 302400000).toISOString(),
    user_id: '7',
    title: 'Friley Hall Movie Night - Marvel Marathon!',
    content: 'Join us for a Marvel movie marathon in the Friley main lounge! Free popcorn, candy, and drinks. Bring blankets and pillows. All residents and guests welcome!',
    category: 'events',
    status: 'active',
    views: 167,
    reply_count: 11,
    upvotes: 35,
    downvotes: 4,
    vote_score: 31,
    event_date: new Date(Date.now() + 259200000).toISOString().split('T')[0], // 3 days
    event_time: '7:00 PM',
    event_end_time: '11:00 PM',
    event_location: 'Friley Hall, Main Lounge',
    author_username: 'friley_ca', author_name: 'ISU Student',
  },
  {
    id: 'e8',
    created_at: new Date(Date.now() - 691200000).toISOString(),
    updated_at: new Date(Date.now() - 345600000).toISOString(),
    user_id: '8',
    title: 'Towers Residence Association: Pancake Study Break',
    content: 'Free pancakes during finals week! All-you-can-eat pancakes, waffles, bacon, and coffee. Perfect midnight snack while you study. Open to all students!',
    category: 'events',
    status: 'active',
    views: 198,
    reply_count: 8,
    upvotes: 44,
    downvotes: 1,
    vote_score: 43,
    event_date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // 2 days
    event_time: '10:00 PM',
    event_end_time: '12:00 AM',
    event_location: 'Towers Dining Center',
    author_username: 'towers_ra', author_name: 'ISU Student',
  },

  // More Campus Events
  {
    id: 'e9',
    created_at: new Date(Date.now() - 777600000).toISOString(),
    updated_at: new Date(Date.now() - 388800000).toISOString(),
    user_id: '9',
    title: 'International Night - Cultural Showcase',
    content: 'Experience cultures from around the world! Food, performances, traditional clothing display, and interactive activities. Hosted by International Student Council.',
    category: 'events',
    status: 'active',
    views: 321,
    reply_count: 27,
    upvotes: 72,
    downvotes: 2,
    vote_score: 70,
    event_date: new Date(Date.now() + 777600000).toISOString().split('T')[0], // 9 days
    event_time: '6:00 PM',
    event_end_time: '9:30 PM',
    event_location: 'Great Hall, Memorial Union',
    author_username: 'intl_council', author_name: 'ISU Student',
  },
  {
    id: 'e10',
    created_at: new Date(Date.now() - 864000000).toISOString(),
    updated_at: new Date(Date.now() - 432000000).toISOString(),
    user_id: '10',
    title: 'Maple Hall Game Tournament - Super Smash Bros',
    content: 'Ultimate Super Smash Bros tournament with prizes! $5 entry, winner takes 70% of pot. Casual and competitive brackets. Stream on Twitch!',
    category: 'events',
    status: 'active',
    views: 143,
    reply_count: 16,
    upvotes: 29,
    downvotes: 3,
    vote_score: 26,
    event_date: new Date(Date.now() + 604800000).toISOString().split('T')[0], // 7 days
    event_time: '6:30 PM',
    event_end_time: '10:00 PM',
    event_location: 'Maple Hall, Game Room',
    author_username: 'maple_gaming', author_name: 'ISU Student',
  },
  {
    id: 'e11',
    created_at: new Date(Date.now() - 950400000).toISOString(),
    updated_at: new Date(Date.now() - 475200000).toISOString(),
    user_id: '11',
    title: 'IEEE: Arduino Basics Workshop for Beginners',
    content: 'Never used Arduino? No problem! Learn programming basics, circuits, and build your first project. All materials provided. Great for resume building!',
    category: 'events',
    status: 'active',
    views: 167,
    reply_count: 13,
    upvotes: 40,
    downvotes: 2,
    vote_score: 38,
    event_date: new Date(Date.now() + 1036800000).toISOString().split('T')[0], // 12 days
    event_time: '5:30 PM',
    event_end_time: '7:30 PM',
    event_location: 'Coover Hall, Lab 3050',
    author_username: 'ieee_workshops', author_name: 'ISU Student',
    event_tags: ['open'],
  },
  {
    id: 'e12',
    created_at: new Date(Date.now() - 1036800000).toISOString(),
    updated_at: new Date(Date.now() - 518400000).toISOString(),
    user_id: '12',
    title: 'Valentine\'s Day Speed Friending - Make New Friends!',
    content: 'Not about dating! Speed friending event to meet new people on campus. 5-minute conversations, icebreaker games, and refreshments. Hosted by Student Union Board.',
    category: 'events',
    status: 'active',
    views: 211,
    reply_count: 19,
    upvotes: 47,
    downvotes: 5,
    vote_score: 42,
    event_date: new Date(Date.now() + 1296000000).toISOString().split('T')[0], // 15 days
    event_time: '7:00 PM',
    event_end_time: '9:00 PM',
    event_location: 'Memorial Union, Gallery',
    author_username: 'sub_social', author_name: 'ISU Student',
  },
  // Add an expired event example
  {
    id: 'e18',
    created_at: new Date(Date.now() - 1728000000).toISOString(),
    updated_at: new Date(Date.now() - 864000000).toISOString(),
    user_id: '18',
    title: 'IEEE Fall Kickoff Meeting',
    content: 'Our first meeting of the semester! Pizza, introductions, and planning for the year ahead.',
    category: 'events',
    status: 'active',
    views: 156,
    reply_count: 12,
    upvotes: 28,
    downvotes: 2,
    vote_score: 26,
    event_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    event_time: '6:00 PM',
    event_end_time: '7:30 PM',
    event_location: 'Coover Hall, Room 2245',
    author_username: 'ieee_president', author_name: 'ISU Student',
    event_tags: ['expired'],
  },
  {
    id: 'e14',
    created_at: new Date(Date.now() - 1209600000).toISOString(),
    updated_at: new Date(Date.now() - 604800000).toISOString(),
    user_id: '14',
    title: 'St. Patrick\'s Day 5K Fun Run - Green Cyclones',
    content: 'Wear green and run! Casual 5K around campus. Prizes for best costumes. T-shirts for all participants. Benefiting local children\'s hospital.',
    category: 'events',
    status: 'active',
    views: 156,
    reply_count: 10,
    upvotes: 33,
    downvotes: 2,
    vote_score: 31,
    event_date: new Date(Date.now() + 1555200000).toISOString().split('T')[0], // 18 days
    event_time: '8:00 AM',
    event_end_time: '10:00 AM',
    event_location: 'Start at Central Campus',
    author_username: 'campus_recreation', author_name: 'ISU Student',
  },
  {
    id: 'e15',
    created_at: new Date(Date.now() - 1296000000).toISOString(),
    updated_at: new Date(Date.now() - 648000000).toISOString(),
    user_id: '15',
    title: 'Friley Residence: Super Bowl Watch Party',
    content: 'Big screen, unlimited wings and nachos, halftime games with prizes! Open to all students. RSVP for accurate food count. Go team!',
    category: 'events',
    status: 'active',
    views: 178,
    reply_count: 14,
    upvotes: 39,
    downvotes: 4,
    vote_score: 35,
    event_date: new Date(Date.now() + 2073600000).toISOString().split('T')[0], // 24 days
    event_time: '5:00 PM',
    event_end_time: '10:00 PM',
    event_location: 'Friley Hall, Main Lounge',
    author_username: 'friley_events', author_name: 'ISU Student',
  },
  {
    id: 'e16',
    created_at: new Date(Date.now() - 1382400000).toISOString(),
    updated_at: new Date(Date.now() - 691200000).toISOString(),
    user_id: '16',
    title: 'IEEE & HKN: Resume Review & Mock Interviews',
    content: 'Get your resume reviewed by industry professionals! Practice interviews, get feedback, improve your chances. Bring printed resumes. Sign up for time slots.',
    category: 'events',
    status: 'active',
    views: 142,
    reply_count: 7,
    upvotes: 36,
    downvotes: 1,
    vote_score: 35,
    event_date: new Date(Date.now() + 950400000).toISOString().split('T')[0], // 11 days
    event_time: '4:00 PM',
    event_end_time: '7:00 PM',
    event_location: 'Coover Hall, Room 1118',
    author_username: 'ieee_career', author_name: 'ISU Student',
  },
];

export default function Events() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<Discussion[]>([]);
  const [sortedEvents, setSortedEvents] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<EventSortOption>('votes');
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  // Sort events when sort option changes
  useEffect(() => {
    // Filter out expired events if showExpired is false
    const filtered = showExpired 
      ? events 
      : events.filter(event => !getEventTags(event).includes('expired'));
    const sorted = sortEvents(filtered, sortBy);
    setSortedEvents(sorted);
  }, [events, sortBy, showExpired]);

  const loadEvents = async () => {
    try {
      // INSTANTLY show demo events from session storage (includes user-created events!)
      const sessionEvents = getDemoDiscussions(DEMO_EVENTS).filter(d => d.category === 'events' || d.event_date);
      setEvents(sessionEvents);
      setLoading(false);
      console.log('Showing demo events instantly:', sessionEvents.length);

      // Then try to load real data in background
      if (DEMO_MODE) {
        console.log('DEMO_MODE enabled - keeping session demo data');
        return;
      }

      console.log('Attempting to fetch real events from Supabase...');
      const { data, error } = await supabase
        .from('events_feed')
        .select('*');

      if (error) {
        console.error('Supabase events error:', error);
        console.log('Keeping demo data');
        return;
      }

      // Only replace demo data if we got real data
      if (data && data.length > 0) {
        console.log('Real events loaded:', data.length);
        setEvents(data);
      } else {
        console.log('No real events - keeping demo data');
      }
    } catch (error) {
      console.error('Error loading events:', error);
      console.log('Keeping demo data');
      // Demo data already showing, so we're good
    }
  };

  const handleAddToCalendar = (event: Discussion) => {
    if (!event.event_date || !event.event_time) return;

    const { startDate, endDate } = createEventDates(
      event.event_date,
      event.event_time,
      event.event_end_time
    );

    const calendarLink = generateGoogleCalendarLink({
      title: event.title,
      description: event.content,
      location: event.event_location,
      startDate,
      endDate,
    });

    window.open(calendarLink, '_blank');
  };

  if (authLoading || !user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Events Feed - Bookster</title>
        <meta name="description" content="Discover campus events at Iowa State University" />
      </Head>

      <Box minH="100vh" display="flex" flexDirection="column" className="bg-gradient-to-br from-gray-50 via-white to-primary-50/20 relative">
        <div className="fixed inset-0 bg-noise opacity-[0.02] pointer-events-none"></div>
        <Header subtitle="Campus Events Feed" />

        <Box className="glass-enhanced border-b border-gray-200/50 rounded-2xl mx-4 my-4 py-8">
          <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="gray.900" mb={2}>
                Upcoming Events
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600" mb={4}>
                Discover campus events sorted by community votes
              </Text>

              {/* Sort Options */}
              <Flex gap={2} mb={4} flexWrap="wrap">
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" display="flex" alignItems="center">
                  Sort by:
                </Text>
                {[
                  { value: 'votes', label: 'Top Rated', icon: 'M7 11l5-5m0 0l5 5m-5-5v12' },
                  { value: 'date', label: 'Date', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                  { value: 'new', label: 'Newest', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { value: 'popular', label: 'Most Popular', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => setSortBy(option.value as EventSortOption)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                        : 'bg-white/80 text-gray-700 border border-gray-200 hover:border-primary-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={option.icon} />
                    </svg>
                    {option.label}
                  </motion.button>
                ))}
              </Flex>

              <Flex gap={4}>
                <Link href="/discussions/new">
                  <motion.button
                    className="btn btn-primary px-6 py-3 flex items-center gap-2"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Post Event
                  </motion.button>
                </Link>
                <Link href="/discussions">
                  <motion.button
                    className="btn btn-secondary px-6 py-3"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    All Discussions
                  </motion.button>
                </Link>
              </Flex>
            </motion.div>
          </Box>
        </Box>

        <Box flex={1} py={8}>
          <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
            <Flex align="center" justify="space-between" mb={6}>
              <Flex align="center" gap={2}>
                <Box w={2} h={2} borderRadius="full" bg="green.500" className="animate-pulse" />
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''}
                </Text>
              </Flex>
              
              <motion.button
                onClick={() => setShowExpired(!showExpired)}
                className="text-xs text-gray-600 hover:text-primary-600 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showExpired ? 'Hide' : 'Show'} Expired Events
              </motion.button>
            </Flex>

            {loading ? (
              <Flex justify="center" py={20}>
                <Box textAlign="center">
                  <div className="spinner w-12 h-12 mx-auto mb-4" />
                  <Text color="gray.600">Loading events...</Text>
                </Box>
              </Flex>
            ) : sortedEvents.length === 0 ? (
              <Box textAlign="center" py={20} className="card-enhanced p-12">
                <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" viewBox="0 0 24 24" fill="none">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <Heading as="h2" fontSize="2xl" fontWeight="bold" color="gray.900" mb={2}>
                  No upcoming events
                </Heading>
                <Text color="gray.600" mb={6}>
                  Be the first to post an event!
                </Text>
              </Box>
            ) : (
              <Box className="space-y-4">
                {sortedEvents.map((event, index) => {
                  const eventTags = getEventTags(event);
                  const isExpired = eventTags.includes('expired');
                  
                  return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`card-enhanced p-6 relative overflow-hidden group ${isExpired ? 'opacity-70' : ''}`}
                  >
                    {/* Top gradient bar */}
                    <Box position="absolute" top={0} left={0} right={0} h={1} className={isExpired ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 'bg-gradient-to-r from-purple-500 to-purple-600'} />

                    <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                      {/* Vote buttons */}
                      <Box>
                        <VoteButtons
                          discussionId={event.id}
                          initialUpvotes={event.upvotes || 0}
                          initialDownvotes={event.downvotes || 0}
                          initialVoteScore={event.vote_score || 0}
                        />
                      </Box>

                      {/* Event content */}
                      <Box flex={1}>
                        {/* Tags */}
                        <Flex gap={2} mb={2} flexWrap="wrap">
                          {event.status === 'pinned' && (
                            <Box className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                              </svg>
                              Pinned
                            </Box>
                          )}
                          
                          {eventTags.map(tag => {
                            const colors = getTagColor(tag);
                            return (
                              <Box
                                key={tag}
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
                              >
                                {tag === 'open' && '🟢'}
                                {tag === 'expired' && '⏰'}
                                {tag === 'full' && '🔒'}
                                {tag === 'cancelled' && '❌'}
                                {' '}{tag.charAt(0).toUpperCase() + tag.slice(1)}
                              </Box>
                            );
                          })}
                        </Flex>

                        <Heading as="h3" fontSize="xl" fontWeight="bold" color="gray.900" mb={2}>
                          {event.title}
                        </Heading>

                        <Text fontSize="sm" color="gray.600" mb={3} className="line-clamp-2">
                          {event.content}
                        </Text>

                        {/* Event details */}
                        {event.event_date && (
                          <Flex direction="column" gap={2} mb={4} className={isExpired ? 'bg-gray-50 rounded-lg p-3' : 'bg-purple-50 rounded-lg p-3'}>
                            <Flex align="center" gap={2} fontSize="sm" color="gray.700">
                              <svg className={`w-4 h-4 ${isExpired ? 'text-gray-500' : 'text-purple-600'}`} viewBox="0 0 24 24" fill="none">
                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              <Text fontWeight="medium">
                                {event.event_date === 'TBD' ? (
                                  <Text as="span" color="orange.600" fontWeight="bold">Date TBD - Check back soon!</Text>
                                ) : (
                                  <>
                                    {formatEventDate(event.event_date)}
                                    {event.event_time && ` at ${event.event_time}`}
                                  </>
                                )}
                              </Text>
                            </Flex>

                            {event.event_location && (
                              <Flex align="center" gap={2} fontSize="sm" color="gray.700">
                                <svg className="w-4 h-4 text-purple-600" viewBox="0 0 24 24" fill="none">
                                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2"/>
                                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                <Text>{event.event_location}</Text>
                              </Flex>
                            )}
                          </Flex>
                        )}

                        {/* Action buttons */}
                        <Flex gap={3} flexWrap="wrap">
                          {!isExpired && event.event_date !== 'TBD' && (
                            <motion.button
                              onClick={() => handleAddToCalendar(event)}
                              className="btn btn-primary text-sm px-4 py-2 flex items-center gap-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M12 11v4m0 0h2m-2 0H10" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              Add to Google Calendar
                            </motion.button>
                          )}

                          <button
                            onClick={() => router.push(`/discussions/${event.id}`)}
                            className="btn btn-secondary text-sm px-4 py-2"
                          >
                            View Details
                          </button>
                        </Flex>

                        {/* Footer */}
                        <Flex justify="space-between" align="center" mt={4} pt={3} borderTop="1px solid" borderColor="gray.100">
                          <Flex gap={4} fontSize="xs" color="gray.500">
                            <Flex align="center" gap={1}>
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              {event.views}
                            </Flex>
                            <Flex align="center" gap={1}>
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              {event.reply_count}
                            </Flex>
                          </Flex>
                          
                          {(event.author_username || event.author_name) && (
                            <Text fontSize="xs" color="gray.500">
                              Posted by {event.author_username || event.author_name}
                            </Text>
                          )}
                        </Flex>
                      </Box>
                    </Flex>
                  </motion.div>
                );
                })}
              </Box>
            )}
          </Box>
        </Box>

        <Footer />
      </Box>
    </>
  );
}

