import type { Discussion } from '@/types/discussions';

/**
 * Check if an event is expired
 */
export function isEventExpired(event: Discussion): boolean {
  if (!event.event_date || event.event_date === 'TBD') return false;
  
  const eventDate = new Date(event.event_date);
  const now = new Date();
  
  // If event has end time, use that
  if (event.event_end_time) {
    const [hours, minutes] = parseTime(event.event_end_time);
    eventDate.setHours(hours, minutes, 59, 999);
  } else {
    // Default: event ends at 11:59 PM on event day
    eventDate.setHours(23, 59, 59, 999);
  }
  
  return eventDate < now;
}

/**
 * Get event status tags
 */
export function getEventTags(event: Discussion): string[] {
  const tags: string[] = [];
  
  // Check for custom tags
  if (event.event_tags) {
    tags.push(...event.event_tags);
  }
  
  // Auto-add expired tag
  if (isEventExpired(event)) {
    if (!tags.includes('expired')) {
      tags.push('expired');
    }
  }
  
  return tags;
}

/**
 * Get tag color scheme
 */
export function getTagColor(tag: string): { bg: string; text: string; border: string } {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    open: { 
      bg: 'bg-green-100', 
      text: 'text-green-700', 
      border: 'border-green-200' 
    },
    expired: { 
      bg: 'bg-gray-100', 
      text: 'text-gray-600', 
      border: 'border-gray-300' 
    },
    full: { 
      bg: 'bg-red-100', 
      text: 'text-red-700', 
      border: 'border-red-200' 
    },
    cancelled: { 
      bg: 'bg-red-100', 
      text: 'text-red-700', 
      border: 'border-red-200' 
    },
  };
  
  return colorMap[tag] || { 
    bg: 'bg-blue-100', 
    text: 'text-blue-700', 
    border: 'border-blue-200' 
  };
}

/**
 * Sort events by different criteria
 */
export function sortEvents(
  events: Discussion[],
  sortBy: 'new' | 'votes' | 'date' | 'popular'
): Discussion[] {
  const sorted = [...events];
  
  // Always show pinned first
  const pinned = sorted.filter(e => e.status === 'pinned');
  const unpinned = sorted.filter(e => e.status !== 'pinned');
  
  let sortedUnpinned: Discussion[];
  
  switch (sortBy) {
    case 'new':
      // Newest first
      sortedUnpinned = unpinned.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
      
    case 'votes':
      // Highest vote score first
      sortedUnpinned = unpinned.sort((a, b) => 
        (b.vote_score || 0) - (a.vote_score || 0)
      );
      break;
      
    case 'date':
      // Soonest event date first
      sortedUnpinned = unpinned.sort((a, b) => {
        if (a.event_date === 'TBD') return 1;
        if (b.event_date === 'TBD') return -1;
        if (!a.event_date) return 1;
        if (!b.event_date) return -1;
        return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
      });
      break;
      
    case 'popular':
      // Most views + replies + votes combined
      sortedUnpinned = unpinned.sort((a, b) => {
        const aScore = (a.views || 0) + (a.reply_count || 0) * 2 + (a.vote_score || 0) * 3;
        const bScore = (b.views || 0) + (b.reply_count || 0) * 2 + (b.vote_score || 0) * 3;
        return bScore - aScore;
      });
      break;
  }
  
  return [...pinned, ...sortedUnpinned];
}

function parseTime(timeStr: string): [number, number] {
  if (timeStr.includes(':')) {
    const [hourStr, minuteStr] = timeStr.split(':');
    let hours = parseInt(hourStr);
    const minutes = parseInt(minuteStr.replace(/[^\d]/g, ''));
    
    if (timeStr.toLowerCase().includes('pm') && hours < 12) {
      hours += 12;
    } else if (timeStr.toLowerCase().includes('am') && hours === 12) {
      hours = 0;
    }
    
    return [hours, minutes];
  }
  
  return [23, 59]; // Default end of day
}

/**
 * Format event date display
 */
export function formatEventDate(eventDate: string | 'TBD'): string {
  if (eventDate === 'TBD') {
    return 'Date TBD';
  }
  
  const date = new Date(eventDate);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays < 7) {
    return `In ${diffDays} days`;
  } else if (diffDays < 14) {
    return `Next week`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
}

