import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Flex, Heading, Text, Button, Input, Textarea } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, DEMO_MODE } from '@/lib/supabase';
import { DISCUSSION_CATEGORIES } from '@/lib/discussions';
import type { CreateDiscussionData } from '@/types/discussions';

export default function NewDiscussion() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateDiscussionData>({
    title: '',
    content: '',
    category: 'general',
    event_date: '',
    event_time: '',
    event_end_time: '',
    event_location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user && !DEMO_MODE) {
      setError('You must be logged in to create a discussion');
      return;
    }

    if (formData.title.length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }

    if (formData.content.length < 10) {
      setError('Content must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push('/discussions');
      } else {
        const { error: insertError } = await supabase
          .from('discussions')
          .insert([{
            user_id: user?.id,
            ...formData,
            status: 'active',
          }]);

        if (insertError) throw insertError;
        router.push('/discussions');
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
      setError('Failed to create discussion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>New Discussion - Bookster</title>
        <meta name="description" content="Start a new discussion" />
      </Head>

      <Box minH="100vh" display="flex" flexDirection="column" className="bg-gradient-to-br from-gray-50 via-white to-primary-50/20 relative">
        <div className="fixed inset-0 bg-noise opacity-[0.02] pointer-events-none"></div>
        <Header subtitle="Create New Discussion" />

        <Box flex={1} py={8}>
          <Box maxW="3xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Box className="glass-enhanced rounded-2xl p-8">
                <Heading as="h1" fontSize="3xl" fontWeight="bold" color="gray.900" mb={2}>
                  Start a Discussion
                </Heading>
                <Text fontSize="md" color="gray.600" mb={8}>
                  Share with the ISU community
                </Text>

                {error && (
                  <Box bg="red.50" border="1px solid" borderColor="red.200" color="red.600" px={4} py={3} borderRadius="xl" mb={6}>
                    {error}
                  </Box>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category */}
                  <Box>
                    <Text as="label" fontSize="sm" fontWeight="semibold" color="gray.700" mb={2} display="block">
                      Category
                    </Text>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="input-enhanced w-full"
                      required
                    >
                      {DISCUSSION_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} - {cat.description}
                        </option>
                      ))}
                    </select>
                  </Box>

                  {/* Title */}
                  <Box>
                    <Text as="label" fontSize="sm" fontWeight="semibold" color="gray.700" mb={2} display="block">
                      Title
                    </Text>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="What's your discussion about?"
                      className="input-enhanced"
                      size="lg"
                      maxLength={200}
                      required
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {formData.title.length}/200 characters
                    </Text>
                  </Box>

                  {/* Content */}
                  <Box>
                    <Text as="label" fontSize="sm" fontWeight="semibold" color="gray.700" mb={2} display="block">
                      Content
                    </Text>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Share your thoughts, ask questions, or provide information..."
                      className="input-enhanced w-full"
                      rows={8}
                      required
                    />
                  </Box>

                  {/* Event-specific fields (only for events category) */}
                  {formData.category === 'events' && (
                    <Box className="bg-purple-50 rounded-xl p-4 space-y-4">
                      <Text fontSize="sm" fontWeight="semibold" color="purple.700" mb={3}>
                        Event Details (Optional - for Google Calendar)
                      </Text>

                      <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
                        <Box flex={1}>
                          <Text as="label" fontSize="sm" fontWeight="medium" color="gray.700" mb={2} display="block">
                            Event Date
                          </Text>
                          <Input
                            type="date"
                            value={formData.event_date}
                            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                            className="input-enhanced"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </Box>

                        <Box flex={1}>
                          <Text as="label" fontSize="sm" fontWeight="medium" color="gray.700" mb={2} display="block">
                            Start Time
                          </Text>
                          <Input
                            type="time"
                            value={formData.event_time}
                            onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                            className="input-enhanced"
                          />
                        </Box>
                      </Flex>

                      <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
                        <Box flex={1}>
                          <Text as="label" fontSize="sm" fontWeight="medium" color="gray.700" mb={2} display="block">
                            End Time
                          </Text>
                          <Input
                            type="time"
                            value={formData.event_end_time}
                            onChange={(e) => setFormData({ ...formData, event_end_time: e.target.value })}
                            className="input-enhanced"
                          />
                        </Box>

                        <Box flex={1}>
                          <Text as="label" fontSize="sm" fontWeight="medium" color="gray.700" mb={2} display="block">
                            Location
                          </Text>
                          <Input
                            type="text"
                            value={formData.event_location}
                            onChange={(e) => setFormData({ ...formData, event_location: e.target.value })}
                            placeholder="Memorial Union, Room 101"
                            className="input-enhanced"
                          />
                        </Box>
                      </Flex>

                      <Box className="bg-white rounded-lg p-3 border border-purple-200">
                        <Text fontSize="xs" color="gray.600">
                          💡 Adding event details enables the &ldquo;Add to Google Calendar&rdquo; button for attendees
                        </Text>
                      </Box>
                    </Box>
                  )}

                  {/* Buttons */}
                  <Flex gap={4} justify="end">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="btn btn-secondary"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Discussion'}
                    </button>
                  </Flex>
                </form>
              </Box>
            </motion.div>
          </Box>
        </Box>

        <Footer />
      </Box>
    </>
  );
}

