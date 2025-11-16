import React, { useState, useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { supabase, isDemoMode } from '@/lib/supabase';
import { getDemoVote, setDemoVote } from '@/lib/demoStorage';
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
    if (user) {
      if (isDemoMode()) {
        // Load vote from session storage
        const savedVote = getDemoVote(discussionId);
        setUserVote(savedVote as 'up' | 'down' | null);
      } else {
        loadUserVote();
      }
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
      if (isDemoMode()) {
        // Demo mode - update UI and save to session storage
        if (userVote === voteType) {
          // Remove vote
          setUserVote(null);
          setDemoVote(discussionId, null); // Save to session storage
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
          setDemoVote(discussionId, voteType); // Save to session storage
          
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
      const oldVote = userVote;

      if (userVote === voteType) {
        // Remove vote
        await supabase
          .from('discussion_votes')
          .delete()
          .eq('discussion_id', discussionId)
          .eq('user_id', user.id);

        setUserVote(null);

        // Update discussion vote counts
        const upvoteChange = voteType === 'up' ? -1 : 0;
        const downvoteChange = voteType === 'down' ? -1 : 0;
        const scoreChange = voteType === 'up' ? -1 : 1;

        await supabase.rpc('update_discussion_votes', {
          p_discussion_id: discussionId,
          p_upvote_change: upvoteChange,
          p_downvote_change: downvoteChange,
          p_score_change: scoreChange,
        }).then(result => {
          // If RPC doesn't exist, update directly
          if (result.error?.code === '42883') {
            return supabase
              .from('discussions')
              .update({
                upvotes: upvotes + upvoteChange,
                downvotes: downvotes + downvoteChange,
                vote_score: voteScore + scoreChange,
              })
              .eq('id', discussionId);
          }
          return result;
        });
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

        // Update discussion vote counts
        let upvoteChange = 0;
        let downvoteChange = 0;
        let scoreChange = 0;

        if (voteType === 'up') {
          upvoteChange = oldVote === 'down' ? 0 : 1;
          downvoteChange = oldVote === 'down' ? -1 : 0;
          scoreChange = oldVote === 'down' ? 2 : 1;
        } else {
          downvoteChange = oldVote === 'up' ? 0 : 1;
          upvoteChange = oldVote === 'up' ? -1 : 0;
          scoreChange = oldVote === 'up' ? -2 : -1;
        }

        await supabase.rpc('update_discussion_votes', {
          p_discussion_id: discussionId,
          p_upvote_change: upvoteChange,
          p_downvote_change: downvoteChange,
          p_score_change: scoreChange,
        }).then(result => {
          // If RPC doesn't exist, update directly
          if (result.error?.code === '42883') {
            return supabase
              .from('discussions')
              .update({
                upvotes: upvotes + upvoteChange,
                downvotes: downvotes + downvoteChange,
                vote_score: voteScore + scoreChange,
              })
              .eq('id', discussionId);
          }
          return result;
        });
      }

      // Reload counts to ensure sync
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
    <Flex align="center" gap={2} className="bg-gradient-to-r from-gray-50 to-white backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-gray-300 shadow-md">
      {/* Upvote */}
      <motion.button
        onClick={() => handleVote('up')}
        disabled={isVoting}
        className={`p-2.5 rounded-lg transition-all shadow-sm ${
          userVote === 'up'
            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
            : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 border-2 border-gray-200 hover:border-green-400'
        }`}
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={userVote === 'up' ? 'currentColor' : 'none'}>
          <path d="M7 11l5-5m0 0l5 5m-5-5v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      {/* Score - More Prominent */}
      <motion.div
        animate={{ scale: userVote ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Text
          fontSize="xl"
          fontWeight="black"
          color={voteScore > 0 ? 'green.600' : voteScore < 0 ? 'red.600' : 'gray.700'}
          minW="50px"
          textAlign="center"
          className="font-mono"
        >
          {voteScore > 0 ? '+' : ''}{voteScore}
        </Text>
      </motion.div>

      {/* Downvote */}
      <motion.button
        onClick={() => handleVote('down')}
        disabled={isVoting}
        className={`p-2.5 rounded-lg transition-all shadow-sm ${
          userVote === 'down'
            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
            : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border-2 border-gray-200 hover:border-red-400'
        }`}
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={userVote === 'down' ? 'currentColor' : 'none'}>
          <path d="M17 13l-5 5m0 0l-5-5m5 5V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </Flex>
  );
};

export default VoteButtons;

