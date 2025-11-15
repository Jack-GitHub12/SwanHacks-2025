// OpenRouter API integration with Gemini 2.5 Flash
// Optimized for efficient token usage

// SECURITY: API key must be stored in environment variables, never hardcoded
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL = 'google/gemini-2.5-flash';

// Validate API key exists
if (!OPENROUTER_API_KEY && typeof window === 'undefined') {
  console.warn('⚠️  OPENROUTER_API_KEY is not set. AI features will not work.');
}

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function callOpenRouter(
  messages: OpenRouterMessage[],
  maxTokens: number = 150 // Keep default low for efficiency
): Promise<{ response: string; usage?: OpenRouterResponse['usage'] }> {
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bookster.app',
        'X-Title': 'Bookster',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data: OpenRouterResponse = await response.json();
    return {
      response: data.choices[0]?.message?.content || '',
      usage: data.usage,
    };
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}

// Efficient prompt templates to minimize token usage
export const promptTemplates = {
  enhanceDescription: (courseCode: string, bookTitle: string, currentNotes: string) => {
    const prompt = currentNotes
      ? `Improve this item listing note (max 100 chars): "${currentNotes}". Course: ${courseCode}, Item: ${bookTitle}`
      : `Create a short selling note (max 100 chars) for: ${bookTitle} (${courseCode})`;
    
    return [
      {
        role: 'system' as const,
        content: 'You are a helpful assistant that writes concise item listing descriptions. Keep responses under 100 characters.',
      },
      {
        role: 'user' as const,
        content: prompt,
      },
    ];
  },

  suggestPrice: (courseCode: string, bookTitle: string, condition: string) => [
    {
      role: 'system' as const,
      content: 'You suggest fair used item prices. Respond with only a number (USD).',
    },
    {
      role: 'user' as const,
      content: `Suggest a price for: ${bookTitle} (${courseCode}), condition: ${condition || 'Good'}`,
    },
  ],

  searchSuggestions: (query: string, availableCourses: string[]) => [
    {
      role: 'system' as const,
      content: 'Suggest relevant course codes based on search query. Respond with comma-separated codes only.',
    },
    {
      role: 'user' as const,
      content: `Query: "${query}". Available: ${availableCourses.slice(0, 20).join(', ')}`,
    },
  ],
};

// Cache for common queries to reduce API calls
const queryCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function cachedQuery(
  cacheKey: string,
  messages: OpenRouterMessage[],
  maxTokens: number = 150
): Promise<string> {
  const cached = queryCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.response;
  }

  const { response } = await callOpenRouter(messages, maxTokens);
  queryCache.set(cacheKey, { response, timestamp: Date.now() });
  
  return response;
}

