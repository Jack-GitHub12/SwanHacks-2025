import type { NextApiRequest, NextApiResponse } from 'next';
import { cachedQuery, promptTemplates } from '@/lib/openrouter';
import { createClient } from '@supabase/supabase-js';

// Security: Rate limiting map (simple in-memory)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per window (higher for search)
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Security: Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Security: CORS headers
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    // Security: Verify authentication
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Security: Rate limiting
    if (!checkRateLimit(user.id)) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const { query, availableCourses } = req.body;

    // Security: Input validation
    if (!query || !availableCourses) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Security: Sanitize inputs
    if (query.length > 200 || !Array.isArray(availableCourses)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const messages = promptTemplates.searchSuggestions(query, availableCourses);
    const cacheKey = `search:${query}:${availableCourses.slice(0, 5).join(',')}`;

    const response = await cachedQuery(cacheKey, messages, 100);

    // Parse comma-separated course codes
    const suggestions = response
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 5);

    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error('AI search suggestions error:', error);
    return res.status(500).json({ error: 'Failed to get suggestions' });
  }
}

