import React from 'react';
import { Box, Flex, Heading, Text, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Discussion } from '@/types/discussions';
import { getCategoryColor, getCategoryName } from '@/lib/discussions';
import { formatDate } from '@/lib/utils';

interface DiscussionCardProps {
  discussion: Discussion;
  index: number;
  onClick: () => void;
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({ discussion, index, onClick }) => {
  const categoryColor = getCategoryColor(discussion.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className="card-enhanced p-6 cursor-pointer relative overflow-hidden group"
    >
      {/* Category indicator bar */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h={1}
        className={`bg-gradient-to-r ${categoryColor}`}
      />

      {/* Header with category */}
      <Flex justify="space-between" align="start" mb={3}>
        <motion.div
          className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${categoryColor}`}
          whileHover={{ scale: 1.05 }}
        >
          {getCategoryName(discussion.category)}
        </motion.div>
        
        {discussion.status === 'pinned' && (
          <Badge colorScheme="yellow" fontSize="xs">
            📌 Pinned
          </Badge>
        )}
      </Flex>

      {/* Title */}
      <Heading
        as="h3"
        fontSize="lg"
        fontWeight="semibold"
        color="gray.900"
        mb={2}
        className="line-clamp-2 group-hover:text-primary-600 transition-colors"
      >
        {discussion.title}
      </Heading>

      {/* Content preview */}
      <Text fontSize="sm" color="gray.600" mb={4} className="line-clamp-2">
        {discussion.content}
      </Text>

      {/* Footer stats */}
      <Flex justify="space-between" align="center" pt={3} borderTop="1px solid" borderColor="gray.100">
        <Flex gap={4} fontSize="xs" color="gray.500">
          <Flex align="center" gap={1}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2"/>
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {discussion.views}
          </Flex>
          <Flex align="center" gap={1}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {discussion.reply_count}
          </Flex>
        </Flex>
        
        <Flex direction="column" align="end">
          <Text fontSize="xs" color="gray.500">{formatDate(discussion.created_at)}</Text>
          {(discussion.author_username || discussion.author_name) && (
            <Text fontSize="xs" color="gray.400" className="truncate max-w-[150px]">
              by {discussion.author_username || discussion.author_name}
            </Text>
          )}
        </Flex>
      </Flex>

      {/* Hover shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.8 }}
        style={{ pointerEvents: 'none' }}
      />
    </motion.div>
  );
};

export default DiscussionCard;

