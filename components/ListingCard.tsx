import React from 'react';
import { Box, Flex, Text, Heading, Badge, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { Listing } from '@/types';
import { formatDate } from '@/lib/utils';

interface ListingCardProps {
  listing: Listing;
  index: number;
  onShowContact: (contactInfo: string) => void;
  currentUserId?: string;
  onEdit?: (listingId: string) => void;
  onDelete?: (listingId: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  index, 
  onShowContact,
  currentUserId,
  onEdit,
  onDelete
}) => {
  const isOwner = currentUserId && listing.user_id === currentUserId;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        delay: Math.min(index * 0.03, 0.3), // Cap delay to avoid slow loads with many items
        ease: "easeOut"
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="card-enhanced p-6 relative overflow-hidden group cursor-pointer"
    >
      {/* Static gradient bar on top - no animation for performance */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary-600 to-secondary-600" />

      {/* Course badge */}
      <Box mb={3}>
        <div className="badge badge-primary inline-flex">
          {listing.course_code}
        </div>
      </Box>

      {/* Book title */}
      <Heading
        as="h3"
        fontSize="xl"
        fontWeight="semibold"
        color="gray.900"
        mb={2}
        className="line-clamp-2 group-hover:text-primary-600 transition-colors"
      >
        {listing.book_title}
      </Heading>

      {/* Price */}
      <div className="text-3xl font-bold text-secondary-600 mb-3">
        ${listing.price.toFixed(2)}
      </div>

      {/* Condition */}
      {listing.condition && (
        <div className="inline-block px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-sm rounded-full mb-3 border border-gray-200">
          <Text as="span" fontWeight="medium">Condition:</Text> {listing.condition}
        </div>
      )}

      {/* Notes */}
      {listing.notes && (
        <Text fontSize="sm" color="gray.600" mb={4} className="line-clamp-2">
          {listing.notes}
        </Text>
      )}

      {/* Footer */}
      <Flex align="center" justify="space-between" pt={4} borderTop="1px solid" borderColor="gray.100">
        <Text fontSize="xs" color="gray.500">{formatDate(listing.created_at)}</Text>
        
        {isOwner ? (
          <Flex gap={2}>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(listing.id);
              }}
              className="btn btn-secondary text-sm px-3 py-1.5 flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(listing.id);
              }}
              className="btn text-sm px-3 py-1.5 flex items-center gap-1 bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </motion.button>
          </Flex>
        ) : (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onShowContact(listing.contact_info);
            }}
            className="btn btn-primary text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Show Contact
          </motion.button>
        )}
      </Flex>

      {/* Simplified glow effect on hover - CSS only for better performance */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-secondary-500/0 to-primary-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ pointerEvents: 'none' }}
      />
    </motion.div>
  );
};

export default ListingCard;
