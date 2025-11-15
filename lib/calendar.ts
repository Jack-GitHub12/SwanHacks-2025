// Google Calendar integration utilities

export interface CalendarEvent {
  title: string;
  description: string;
  location?: string;
  startDate: Date;
  endDate: Date;
}

/**
 * Generate Google Calendar add event URL
 * @param event Event details
 * @returns Google Calendar URL
 */
export function generateGoogleCalendarLink(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    dates: `${formatDate(event.startDate)}/${formatDate(event.endDate)}`,
  });

  if (event.location) {
    params.append('location', event.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Parse event date and time to create start/end dates
 */
export function createEventDates(
  eventDate: string,
  startTime: string,
  endTime?: string,
  durationHours: number = 2
): { startDate: Date; endDate: Date } {
  const date = new Date(eventDate);
  
  // Parse start time (format: "HH:MM" or "HH:MM AM/PM")
  const [hours, minutes] = parseTime(startTime);
  date.setHours(hours, minutes, 0, 0);
  
  const startDate = new Date(date);
  
  // Calculate end date
  let endDate: Date;
  if (endTime) {
    const [endHours, endMinutes] = parseTime(endTime);
    endDate = new Date(date);
    endDate.setHours(endHours, endMinutes, 0, 0);
  } else {
    endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + durationHours);
  }
  
  return { startDate, endDate };
}

function parseTime(timeStr: string): [number, number] {
  // Handle 24-hour format (HH:MM)
  if (timeStr.includes(':')) {
    const [hourStr, minuteStr] = timeStr.split(':');
    let hours = parseInt(hourStr);
    const minutes = parseInt(minuteStr.replace(/[^\d]/g, ''));
    
    // Handle AM/PM
    if (timeStr.toLowerCase().includes('pm') && hours < 12) {
      hours += 12;
    } else if (timeStr.toLowerCase().includes('am') && hours === 12) {
      hours = 0;
    }
    
    return [hours, minutes];
  }
  
  return [12, 0]; // Default noon
}

/**
 * Format event date and time for display
 */
export function formatEventDateTime(eventDate: string, eventTime?: string): string {
  const date = new Date(eventDate);
  const dateStr = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  if (eventTime) {
    return `${dateStr} at ${eventTime}`;
  }
  
  return dateStr;
}

