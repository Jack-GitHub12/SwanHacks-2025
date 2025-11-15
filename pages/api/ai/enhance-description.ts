import type { NextApiRequest, NextApiResponse } from 'next';
import { callOpenRouter, promptTemplates } from '@/lib/openrouter';
import { createClient } from '@supabase/supabase-js';

// Security: Rate limiting map (simple in-memory)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
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
    // Demo mode: Return mock enhanced description
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      const { courseCode, bookTitle, currentNotes } = req.body;

      // Security: Input validation even in demo mode
      if (!courseCode || !bookTitle) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate a realistic demo enhancement
      const demoEnhancement = currentNotes
        ? `${currentNotes}\n\nEnhanced with AI: This textbook for ${courseCode} is in great condition and includes all chapters needed for the course. Perfect for students looking for a reliable study resource.`
        : `This textbook for ${courseCode} (${bookTitle}) is in excellent condition with minimal wear. All pages are intact and readable. Great resource for mastering the course material. Includes practice problems and comprehensive explanations.`;

      return res.status(200).json({
        enhancedDescription: demoEnhancement,
        tokensUsed: 0,
        demo: true
      });
    }

    // Check if OpenRouter API key is configured
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key') {
      return res.status(503).json({
        error: 'AI features are not configured. Please add a valid OPENROUTER_API_KEY to your environment variables.'
      });
    }

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

    const { courseCode, bookTitle, currentNotes } = req.body;

    // Security: Input validation
    if (!courseCode || !bookTitle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Security: Sanitize inputs (limit length)
    if (courseCode.length > 20 || bookTitle.length > 500 || (currentNotes && currentNotes.length > 1000)) {
      return res.status(400).json({ error: 'Input too long' });
    }

    const messages = promptTemplates.enhanceDescription(
      courseCode,
      bookTitle,
      currentNotes || ''
    );

    const { response, usage } = await callOpenRouter(messages, 100);

    return res.status(200).json({
      enhancedDescription: response.trim(),
      tokensUsed: usage?.total_tokens || 0,
    });
  } catch (error) {
    console.error('AI enhance error:', error);
    return res.status(500).json({ error: 'Failed to enhance description' });
  }
}

