import React, { useState, useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { supabase, DEMO_MODE } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface VoteButtonsProps {
  discussionId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  initialVoteScore: number;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  discussionId,
  initialUpvotes,
  initialDownvotes,
  initialVoteScore,
}) => {
  const { user } = useAuth();
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [voteScore, setVoteScore] = useState(initialVoteScore);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (user && !DEMO_MODE) {
      loadUserVote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, discussionId]);

  const loadUserVote = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('discussion_votes')
        .select('vote_type')
        .eq('discussion_id', discussionId)
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setUserVote(data.vote_type as 'up' | 'down');
      }
    } catch (error) {
      // No vote found - that's okay
    }
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user || isVoting) return;
    setIsVoting(true);

    try {
      if (DEMO_MODE) {
        // Demo mode - just update UI
        if (userVote === voteType) {
          // Remove vote
          setUserVote(null);
          if (voteType === 'up') {
            setUpvotes(upvotes - 1);
            setVoteScore(voteScore - 1);
          } else {
            setDownvotes(downvotes - 1);
            setVoteScore(voteScore + 1);
          }
        } else {
          // Change or add vote
          const oldVote = userVote;
          setUserVote(voteType);
          
          if (voteType === 'up') {
            setUpvotes(oldVote === 'down' ? upvotes : upvotes + 1);
            setDownvotes(oldVote === 'down' ? downvotes - 1 : downvotes);
            setVoteScore(oldVote === 'down' ? voteScore + 2 : voteScore + 1);
          } else {
            setDownvotes(oldVote === 'up' ? downvotes : downvotes + 1);
            setUpvotes(oldVote === 'up' ? upvotes - 1 : upvotes);
            setVoteScore(oldVote === 'up' ? voteScore - 2 : voteScore - 1);
          }
        }
        return;
      }

      // Real database operation
      if (userVote === voteType) {
        // Remove vote
        await supabase
          .from('discussion_votes')
          .delete()
          .eq('discussion_id', discussionId)
          .eq('user_id', user.id);
        setUserVote(null);
      } else {
        // Upsert vote
        await supabase
          .from('discussion_votes')
          .upsert({
            discussion_id: discussionId,
            user_id: user.id,
            vote_type: voteType,
          });
        setUserVote(voteType);
      }

      // Reload counts
      await loadVoteCounts();
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const loadVoteCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('discussions')
        .select('upvotes, downvotes, vote_score')
        .eq('id', discussionId)
        .single();

      if (!error && data) {
        setUpvotes(data.upvotes || 0);
        setDownvotes(data.downvotes || 0);
        setVoteScore(data.vote_score || 0);
      }
    } catch (error) {
      console.error('Error loading vote counts:', error);
    }
  };

  return (
    <Flex align="center" gap={2} className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-200">
      {/* Upvote */}
      <motion.button
        onClick={() => handleVote('up')}
        disabled={isVoting}
        className={`p-2 rounded-lg transition-all ${
          userVote === 'up'
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M7 11l5-5m0 0l5 5m-5-5v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      {/* Score */}
      <Text
        fontSize="lg"
        fontWeight="bold"
        color={voteScore > 0 ? 'green.600' : voteScore < 0 ? 'red.600' : 'gray.600'}
        minW="40px"
        textAlign="center"
      >
        {voteScore > 0 ? '+' : ''}{voteScore}
      </Text>

      {/* Downvote */}
      <motion.button
        onClick={() => handleVote('down')}
        disabled={isVoting}
        className={`p-2 rounded-lg transition-all ${
          userVote === 'down'
            ? 'bg-red-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M17 13l-5 5m0 0l-5-5m5 5V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </Flex>
  );
};

export default VoteButtons;

