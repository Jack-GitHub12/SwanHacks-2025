// Utility functions for Bookster

/**
 * Format date for display (e.g., "Posted today", "Posted 3 days ago")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Posted today';
  } else if (diffDays === 1) {
    return 'Posted yesterday';
  } else if (diffDays < 7) {
    return `Posted ${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Posted ${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    return `Posted on ${date.toLocaleDateString()}`;
  }
}

/**
 * Validate course code format (e.g., "CS 161", "MATH 165")
 */
export function isValidCourseCode(code: string): boolean {
  const pattern = /^[A-Z]{2,4}\s?\d{3}[A-Z]?$/i;
  return pattern.test(code.trim());
}

/**
 * Validate contact information (phone or email)
 */
export function isValidContact(contact: string): boolean {
  // Check for phone number patterns
  const phonePattern = /^[\d\s\-\(\)\+\.]+$/;
  if (phonePattern.test(contact) && contact.replace(/\D/g, '').length >= 10) {
    return true;
  }

  // Check for email pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(contact)) {
    return true;
  }

  // Allow other contact methods with at least 5 characters
  return contact.length >= 5;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      console.error('Failed to copy text:', fallbackError);
      return false;
    }
  }
}

/**
 * Auto-format course code as user types
 */
export function formatCourseCode(value: string): string {
  const upperValue = value.toUpperCase();
  // Auto-add space after department code
  if (upperValue.length >= 2 && upperValue.length <= 4 && !upperValue.includes(' ')) {
    const match = upperValue.match(/^([A-Z]{2,4})(\d+)/);
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
  }
  return upperValue;
}

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate price is within acceptable range
 */
export function isValidPrice(price: number): boolean {
  return !isNaN(price) && price > 0 && price <= 9999;
}

/**
 * Validate text length
 */
export function isValidLength(text: string, min: number, max: number): boolean {
  const length = text.trim().length;
  return length >= min && length <= max;
}

/**
 * Generate Google Calendar link for an event
 */
export function generateGoogleCalendarLink(
  title: string,
  description: string,
  location: string,
  startDate: string,
  startTime: string,
  endTime?: string
): string {
  // Format: YYYYMMDDTHHmmss
  const formatDateTime = (date: string, time: string): string => {
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    return `${year}${month}${day}T${hours}${minutes}00`;
  };

  const start = formatDateTime(startDate, startTime);

  // If no end time, default to 1 hour after start
  let end: string;
  if (endTime) {
    end = formatDateTime(startDate, endTime);
  } else {
    const startDateTime = new Date(`${startDate}T${startTime}`);
    startDateTime.setHours(startDateTime.getHours() + 1);
    const endHours = String(startDateTime.getHours()).padStart(2, '0');
    const endMinutes = String(startDateTime.getMinutes()).padStart(2, '0');
    end = formatDateTime(startDate, `${endHours}:${endMinutes}`);
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: description,
    location: location,
    dates: `${start}/${end}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

