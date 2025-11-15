// Demo mode session storage utilities
// Stores user-created data in localStorage for the current session

const STORAGE_KEYS = {
  LISTINGS: 'bookster_demo_listings',
  DISCUSSIONS: 'bookster_demo_discussions',
  REPLIES: 'bookster_demo_replies',
  VOTES: 'bookster_demo_votes',
  PROFILE: 'bookster_demo_profile',
};

// Generic get/set functions
export const getDemoData = <T>(key: string, defaultData: T): T => {
  if (typeof window === 'undefined') return defaultData;
  
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch (error) {
    console.error('Error reading demo storage:', error);
    return defaultData;
  }
};

export const setDemoData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing demo storage:', error);
  }
};

// Specific functions for each data type
export const getDemoListings = (defaultListings: any[]) => {
  return getDemoData(STORAGE_KEYS.LISTINGS, defaultListings);
};

export const setDemoListings = (listings: any[]) => {
  setDemoData(STORAGE_KEYS.LISTINGS, listings);
};

export const addDemoListing = (newListing: any, defaultListings: any[]) => {
  const current = getDemoListings(defaultListings);
  const updated = [newListing, ...current];
  setDemoListings(updated);
  return updated;
};

export const updateDemoListing = (id: string, updates: any, defaultListings: any[]) => {
  const current = getDemoListings(defaultListings);
  const updated = current.map(item => 
    item.id === id ? { ...item, ...updates } : item
  );
  setDemoListings(updated);
  return updated;
};

export const deleteDemoListing = (id: string, defaultListings: any[]) => {
  const current = getDemoListings(defaultListings);
  const updated = current.filter(item => item.id !== id);
  setDemoListings(updated);
  return updated;
};

// Discussion functions
export const getDemoDiscussions = (defaultDiscussions: any[]) => {
  return getDemoData(STORAGE_KEYS.DISCUSSIONS, defaultDiscussions);
};

export const setDemoDiscussions = (discussions: any[]) => {
  setDemoData(STORAGE_KEYS.DISCUSSIONS, discussions);
};

export const addDemoDiscussion = (newDiscussion: any, defaultDiscussions: any[]) => {
  const current = getDemoDiscussions(defaultDiscussions);
  const updated = [newDiscussion, ...current];
  setDemoDiscussions(updated);
  return updated;
};

// Reply functions
export const getDemoReplies = (discussionId: string, defaultReplies: any[]) => {
  const allReplies = getDemoData(STORAGE_KEYS.REPLIES, {});
  return allReplies[discussionId] || defaultReplies;
};

export const addDemoReply = (discussionId: string, newReply: any, defaultReplies: any[]) => {
  const allReplies = getDemoData(STORAGE_KEYS.REPLIES, {});
  const discussionReplies = allReplies[discussionId] || defaultReplies;
  const updated = [...discussionReplies, newReply];
  
  setDemoData(STORAGE_KEYS.REPLIES, {
    ...allReplies,
    [discussionId]: updated,
  });
  
  return updated;
};

// Profile functions
export const getDemoProfile = (defaultProfile: any) => {
  return getDemoData(STORAGE_KEYS.PROFILE, defaultProfile);
};

export const setDemoProfile = (profile: any) => {
  setDemoData(STORAGE_KEYS.PROFILE, profile);
};

// Vote functions
export const getDemoVote = (discussionId: string) => {
  const votes = getDemoData(STORAGE_KEYS.VOTES, {});
  return votes[discussionId] || null;
};

export const setDemoVote = (discussionId: string, voteType: 'up' | 'down' | null) => {
  const votes = getDemoData(STORAGE_KEYS.VOTES, {});
  const updated = { ...votes };
  
  if (voteType === null) {
    delete updated[discussionId];
  } else {
    updated[discussionId] = voteType;
  }
  
  setDemoData(STORAGE_KEYS.VOTES, updated);
};

// Clear all demo data
export const clearDemoData = () => {
  if (typeof window === 'undefined') return;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

