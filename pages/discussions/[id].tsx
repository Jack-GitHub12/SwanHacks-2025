import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Flex, Heading, Text, Button, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VoteButtons from '@/components/VoteButtons';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, DEMO_MODE } from '@/lib/supabase';
import { getCategoryColor, getCategoryName } from '@/lib/discussions';
import { formatDate, generateGoogleCalendarLink } from '@/lib/utils';
import type { Discussion, DiscussionReply } from '@/types/discussions';

// Demo data for testing
const DEMO_DISCUSSION: Discussion = {
  id: '1',
  created_at: new Date(Date.now() - 3600000).toISOString(),
  updated_at: new Date(Date.now() - 3600000).toISOString(),
  user_id: '1',
  title: 'ISU Cycling Club - New Members Welcome!',
  content: 'Hey everyone! The ISU Cycling Club is looking for new members. We ride every weekend and do social events. All skill levels welcome!\n\nWe meet every Saturday at 9 AM at the Memorial Union. Our rides are typically 15-25 miles, and we have different pace groups to accommodate all fitness levels.\n\nWe also have weekly social meetups on Wednesday evenings where we discuss upcoming events, plan routes, and just hang out.\n\nIf you\'re interested, just show up or DM me for more info!',
  category: 'clubs',
  status: 'pinned',
  views: 124,
  reply_count: 3,
  author_username: 'cyclist',
  author_name: 'ISU Cyclist',
};

const DEMO_REPLIES: DiscussionReply[] = [
  {
    id: '1',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    discussion_id: '1',
    user_id: '2',
    content: 'This sounds great! I\'ve been wanting to get into cycling. Do I need to bring my own bike?',
    author_username: 'student1',
    author_name: 'Curious Student',
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 900000).toISOString(),
    updated_at: new Date(Date.now() - 900000).toISOString(),
    discussion_id: '1',
    user_id: '1',
    content: 'Yes, you\'ll need your own bike. But if you don\'t have one yet, come to our Wednesday meetup and we can help you find a good starter bike!',
    author_username: 'cyclist',
    author_name: 'ISU Cyclist',
    parent_reply_id: '1',
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 600000).toISOString(),
    updated_at: new Date(Date.now() - 600000).toISOString(),
    discussion_id: '1',
    user_id: '3',
    content: 'I\'m definitely interested! See you Saturday!',
    author_username: 'newbie',
    author_name: 'New Rider',
  },
];

export default function DiscussionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<DiscussionReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load discussion and replies
  useEffect(() => {
    if (id && user) {
      loadDiscussion();
      loadReplies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const loadDiscussion = async () => {
    try {
      if (DEMO_MODE) {
        setDiscussion(DEMO_DISCUSSION);
        // Increment view count in demo mode (just for UI)
        setDiscussion(prev => prev ? { ...prev, views: prev.views + 1 } : null);
      } else {
        const { data, error } = await supabase
          .from('discussions_with_user')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setDiscussion(data);

        // Increment view count
        await supabase.rpc('increment_discussion_views', { discussion_id: id });
      }
    } catch (error) {
      console.error('Error loading discussion:', error);
      setError('Failed to load discussion');
    } finally {
      setLoading(false);
    }
  };

  const loadReplies = async () => {
    try {
      if (DEMO_MODE) {
        setReplies(DEMO_REPLIES);
      } else {
        const { data, error } = await supabase
          .from('discussion_replies_with_user')
          .select('*')
          .eq('discussion_id', id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setReplies(data || []);
      }
    } catch (error) {
      console.error('Error loading replies:', error);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user && !DEMO_MODE) {
      setError('You must be logged in to reply');
      return;
    }

    if (replyContent.trim().length < 1) {
      setError('Reply cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newReply: DiscussionReply = {
          id: String(Date.now()),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          discussion_id: id as string,
          user_id: user?.id || 'demo-user',
          content: replyContent,
          author_username: user?.email?.split('@')[0] || 'demo_user',
          author_name: user?.email?.split('@')[0] || 'Demo User',
          parent_reply_id: replyingTo || undefined,
        };
        setReplies([...replies, newReply]);
        // Update discussion reply count in demo mode
        if (discussion) {
          setDiscussion({ ...discussion, reply_count: (discussion.reply_count || 0) + 1 });
        }
        setReplyContent('');
        setReplyingTo(null);
      } else {
        const { error: insertError } = await supabase
          .from('discussion_replies')
          .insert([{
            discussion_id: id,
            user_id: user?.id,
            content: replyContent,
            parent_reply_id: replyingTo,
          }]);

        if (insertError) throw insertError;

        // Update reply count
        const { error: updateError } = await supabase
          .from('discussions')
          .update({ reply_count: replies.length + 1 })
          .eq('id', id);

        if (updateError) console.error('Error updating reply count:', updateError);

        setReplyContent('');
        setReplyingTo(null);
        await loadReplies();
        await loadDiscussion(); // Reload to get updated count
      }
    } catch (error: any) {
      console.error('Error submitting reply:', error);
      setError('Failed to submit reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;

    try {
      if (DEMO_MODE) {
        setReplies(replies.filter(r => r.id !== replyId));
        // Update discussion reply count in demo mode
        if (discussion) {
          setDiscussion({ ...discussion, reply_count: Math.max(0, (discussion.reply_count || 0) - 1) });
        }
      } else {
        const { error: deleteError } = await supabase
          .from('discussion_replies')
          .delete()
          .eq('id', replyId);

        if (deleteError) throw deleteError;

        // Update reply count
        const { error: updateError } = await supabase
          .from('discussions')
          .update({ reply_count: replies.length - 1 })
          .eq('id', id);

        if (updateError) console.error('Error updating reply count:', updateError);

        await loadReplies();
        await loadDiscussion(); // Reload to get updated count
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      setError('Failed to delete reply');
    }
  };

  const getReplyById = (replyId: string) => {
    return replies.find(r => r.id === replyId);
  };

  if (authLoading || loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" className="bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
        <Box textAlign="center">
          <div className="spinner w-12 h-12 mx-auto mb-4" />
          <Text color="gray.600">Loading discussion...</Text>
        </Box>
      </Flex>
    );
  }

  if (!user) return null;

  if (!discussion) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" className="bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
        <Header subtitle="Discussion Not Found" />
        <Flex flex={1} align="center" justify="center">
          <Box textAlign="center">
            <Heading fontSize="2xl" mb={4}>Discussion not found</Heading>
            <Link href="/discussions">
              <Button className="btn btn-primary">Back to Discussions</Button>
            </Link>
          </Box>
        </Flex>
        <Footer />
      </Box>
    );
  }

  const categoryColor = getCategoryColor(discussion.category);

  return (
    <>
      <Head>
        <title>{discussion.title} - Bookster</title>
        <meta name="description" content={discussion.content.substring(0, 160)} />
      </Head>

      <Box minH="100vh" display="flex" flexDirection="column" className="bg-gradient-to-br from-gray-50 via-white to-primary-50/20 relative">
        <div className="fixed inset-0 bg-noise opacity-[0.02] pointer-events-none"></div>
        <Header subtitle="Discussion" />

        <Box flex={1} py={8}>
          <Box maxW="5xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
            {/* Back button */}
            <Link href="/discussions">
              <motion.button
                className="btn btn-secondary mb-6 flex items-center gap-2"
                whileHover={{ x: -4 }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5m7-7l-7 7 7 7" />
                </svg>
                Back to Discussions
              </motion.button>
            </Link>

            {/* Discussion Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-enhanced p-8 mb-8"
            >
              {/* Category and status badges */}
              <Flex justify="space-between" align="start" mb={4} flexWrap="wrap" gap={2}>
                <div className={`px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${categoryColor}`}>
                  {getCategoryName(discussion.category)}
                </div>

                <Flex gap={2}>
                  {discussion.status === 'pinned' && (
                    <Badge colorScheme="yellow" fontSize="sm" px={3} py={1}>
                      📌 Pinned
                    </Badge>
                  )}
                  <Flex align="center" gap={4} fontSize="sm" color="gray.500">
                    <Flex align="center" gap={1}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {discussion.views} views
                    </Flex>
                    <Flex align="center" gap={1}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {discussion.reply_count} replies
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>

              {/* Title */}
              <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="gray.900" mb={4}>
                {discussion.title}
              </Heading>

              {/* Author and date */}
              <Flex align="center" gap={3} mb={6} pb={6} borderBottom="2px solid" borderColor="gray.100">
                <Box w={10} h={10} borderRadius="full" bg="gradient-to-br from-primary-400 to-secondary-400" display="flex" alignItems="center" justifyContent="center" color="white" fontWeight="bold">
                  {(discussion.author_username || discussion.author_name || 'U').charAt(0).toUpperCase()}
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                    {discussion.author_username || discussion.author_name || 'Unknown'}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Posted {formatDate(discussion.created_at)}
                  </Text>
                </Box>
              </Flex>

              {/* Content */}
              <Box fontSize="md" color="gray.700" className="whitespace-pre-wrap" mb={6}>
                {discussion.content}
              </Box>

              {/* Voting Section - Highly Visible */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-blue-200 shadow-md"
              >
                <Flex direction={{ base: 'column', md: 'row' }} gap={4} align={{ base: 'start', md: 'center' }} justify="space-between">
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={1}>
                      What do you think about this discussion?
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Vote to show your opinion on this topic
                    </Text>
                  </Box>
                  <VoteButtons
                    discussionId={discussion.id}
                    initialUpvotes={discussion.upvotes || 0}
                    initialDownvotes={discussion.downvotes || 0}
                    initialVoteScore={discussion.vote_score || 0}
                  />
                </Flex>
              </motion.div>

              {/* Event Details & Calendar Button (for events category) */}
              {discussion.category === 'events' && discussion.event_date && discussion.event_time && (
                <Box className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                  <Flex direction={{ base: 'column', md: 'row' }} gap={6} align={{ base: 'start', md: 'center' }} justify="space-between">
                    <Box>
                      <Flex align="center" gap={2} mb={3}>
                        <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <Text fontSize="lg" fontWeight="bold" color="purple.900">Event Details</Text>
                      </Flex>
                      <Box className="space-y-2">
                        <Flex align="center" gap={2}>
                          <Text fontSize="sm" fontWeight="semibold" color="purple.700" minW={20}>Date:</Text>
                          <Text fontSize="sm" color="gray.700">
                            {new Date(discussion.event_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Text>
                        </Flex>
                        <Flex align="center" gap={2}>
                          <Text fontSize="sm" fontWeight="semibold" color="purple.700" minW={20}>Time:</Text>
                          <Text fontSize="sm" color="gray.700">
                            {discussion.event_time}
                            {discussion.event_end_time && ` - ${discussion.event_end_time}`}
                          </Text>
                        </Flex>
                        {discussion.event_location && (
                          <Flex align="start" gap={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="purple.700" minW={20}>Location:</Text>
                            <Text fontSize="sm" color="gray.700">{discussion.event_location}</Text>
                          </Flex>
                        )}
                      </Box>
                    </Box>

                    <motion.a
                      href={generateGoogleCalendarLink(
                        discussion.title,
                        discussion.content,
                        discussion.event_location || '',
                        discussion.event_date,
                        discussion.event_time,
                        discussion.event_end_time
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Add to Google Calendar
                    </motion.a>
                  </Flex>
                </Box>
              )}
            </motion.div>

            {/* Replies Section */}
            <Box className="card-enhanced p-8">
              <Heading as="h2" fontSize="xl" fontWeight="bold" color="gray.900" mb={6}>
                Replies ({replies.length})
              </Heading>

              {/* Reply Form */}
              <Box mb={8} className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6">
                {replyingTo && (
                  <Flex align="center" justify="space-between" mb={4} className="bg-white/80 rounded-lg p-3">
                    <Text fontSize="sm" color="gray.600">
                      Replying to {getReplyById(replyingTo)?.author_username || getReplyById(replyingTo)?.author_name || 'user'}
                    </Text>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </Flex>
                )}

                {error && (
                  <Box bg="red.50" border="1px solid" borderColor="red.200" color="red.600" px={4} py={3} borderRadius="xl" mb={4}>
                    {error}
                  </Box>
                )}

                <form onSubmit={handleSubmitReply}>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    className="input-enhanced w-full mb-4"
                    rows={4}
                    required
                  />
                  <Flex justify="end" gap={3}>
                    {replyingTo && (
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                      >
                        Cancel Reply
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Posting...' : 'Post Reply'}
                    </button>
                  </Flex>
                </form>
              </Box>

              {/* Replies List */}
              <Box className="space-y-4">
                {replies.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">No replies yet. Be the first to reply!</Text>
                  </Box>
                ) : (
                  replies.map((reply, index) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-primary-200 transition-all ${
                        reply.parent_reply_id ? 'ml-8 border-l-4 border-l-primary-300' : ''
                      }`}
                    >
                      {/* Reply author */}
                      <Flex align="center" justify="space-between" mb={3}>
                        <Flex align="center" gap={3}>
                          <Box w={8} h={8} borderRadius="full" bg="gradient-to-br from-primary-300 to-secondary-300" display="flex" alignItems="center" justifyContent="center" color="white" fontWeight="bold" fontSize="sm">
                            {(reply.author_username || reply.author_name || 'U').charAt(0).toUpperCase()}
                          </Box>
                          <Box>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                              {reply.author_username || reply.author_name || 'Unknown'}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {formatDate(reply.created_at)}
                            </Text>
                          </Box>
                        </Flex>

                        <Flex gap={2}>
                          <motion.button
                            onClick={() => setReplyingTo(reply.id)}
                            className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Reply
                          </motion.button>

                          {(reply.user_id === user?.id || DEMO_MODE) && (
                            <motion.button
                              onClick={() => handleDeleteReply(reply.id)}
                              className="text-xs px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Delete
                            </motion.button>
                          )}
                        </Flex>
                      </Flex>

                      {/* Reply content */}
                      <Text fontSize="sm" color="gray.700" className="whitespace-pre-wrap">
                        {reply.content}
                      </Text>

                      {/* Show if this is a reply to another comment */}
                      {reply.parent_reply_id && getReplyById(reply.parent_reply_id) && (
                        <Box mt={3} pt={3} borderTop="1px solid" borderColor="gray-100">
                          <Text fontSize="xs" color="gray.500">
                            In reply to {getReplyById(reply.parent_reply_id)?.author_username || getReplyById(reply.parent_reply_id)?.author_name || 'user'}
                          </Text>
                        </Box>
                      )}
                    </motion.div>
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <Footer />
      </Box>
    </>
  );
}
