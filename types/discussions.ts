export interface Discussion {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  content: string;
  category: 'clubs' | 'events' | 'general' | 'study-groups' | 'housing' | 'jobs';
  status: 'active' | 'closed' | 'pinned';
  views: number;
  reply_count: number;
  author_name?: string;
  author_username?: string;
  // Event-specific fields
  event_date?: string | 'TBD';
  event_time?: string;
  event_end_time?: string;
  event_location?: string;
  event_tags?: ('open' | 'expired' | 'full' | 'cancelled')[];
  // Voting fields
  upvotes?: number;
  downvotes?: number;
  vote_score?: number;
}

export type EventSortOption = 'new' | 'votes' | 'date' | 'popular';

export interface DiscussionVote {
  id: string;
  created_at: string;
  discussion_id: string;
  user_id: string;
  vote_type: 'up' | 'down';
}

export interface DiscussionReply {
  id: string;
  created_at: string;
  updated_at: string;
  discussion_id: string;
  user_id: string;
  content: string;
  parent_reply_id?: string;
  author_name?: string;
  author_username?: string;
}

export interface CreateDiscussionData {
  title: string;
  content: string;
  category: Discussion['category'];
  event_date?: string;
  event_time?: string;
  event_end_time?: string;
  event_location?: string;
}

export interface CreateReplyData {
  discussion_id: string;
  content: string;
  parent_reply_id?: string;
}

