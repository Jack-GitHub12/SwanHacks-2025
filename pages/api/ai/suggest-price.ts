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
    const { courseCode, bookTitle, condition } = req.body;

    // Security: Input validation
    if (!courseCode || !bookTitle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Demo mode: Return mock price suggestion
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Generate realistic price based on condition
      const basePrice = 80 + Math.random() * 40; // $80-$120
      const conditionMultiplier = condition === 'New' ? 1.2 : condition === 'Like New' ? 1.1 : condition === 'Fair' ? 0.8 : 1.0;
      const suggestedPrice = Math.round(basePrice * conditionMultiplier / 5) * 5; // Round to nearest $5

      return res.status(200).json({
        suggestedPrice,
        explanation: `Based on ${courseCode} course materials and ${condition || 'Good'} condition, this is a fair market price.`,
        tokensUsed: 0,
        demo: true
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

    // Security: Sanitize inputs (limit length)
    if (courseCode.length > 20 || bookTitle.length > 500) {
      return res.status(400).json({ error: 'Input too long' });
    }

    const messages = promptTemplates.suggestPrice(
      courseCode,
      bookTitle,
      condition || 'Good'
    );

    const { response, usage } = await callOpenRouter(messages, 50);

    // Extract numeric value from response
    const priceMatch = response.match(/\d+(\.\d+)?/);
    const suggestedPrice = priceMatch ? parseFloat(priceMatch[0]) : null;

    return res.status(200).json({
      suggestedPrice,
      tokensUsed: usage?.total_tokens || 0,
    });
  } catch (error) {
    console.error('AI price suggestion error:', error);
    return res.status(500).json({ error: 'Failed to suggest price' });
  }
}

