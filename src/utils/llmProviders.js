// Test prompts for each provider
const TEST_PROMPTS = {
  OpenAI: {
    prompt: 'Say "Hello, World!"',
    model: 'gpt-3.5-turbo',
  },
  Anthropic: {
    prompt: 'Human: Say "Hello, World!"\nAssistant:',
    model: 'claude-2',
  },
  'Google Gemini': {
    prompt: 'Say "Hello, World!"',
    model: 'gemini-pro',
  },
  'OpenAI Compatible': {
    prompt: 'Say "Hello, World!"',
    model: 'gpt-3.5-turbo',
  },
};

// Provider-specific API endpoints
const API_ENDPOINTS = {
  OpenAI: 'https://api.openai.com/v1/chat/completions',
  Anthropic: 'https://api.anthropic.com/v1/messages',
  'Google Gemini': 'https://generativelanguage.googleapis.com/v1/models',
  'OpenAI Compatible': '', // Will be set from baseUrl
};

export async function testConnection(config) {
  const { provider, apiKey, modelName, baseUrl } = config;
  
  try {
    let endpoint = API_ENDPOINTS[provider];
    if (provider === 'OpenAI Compatible') {
      endpoint = `${baseUrl}/chat/completions`;
    }

    let headers = {
      'Content-Type': 'application/json',
    };

    let body = {};

    // Configure provider-specific headers and body
    switch (provider) {
      case 'OpenAI':
      case 'OpenAI Compatible':
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = {
          model: modelName || TEST_PROMPTS[provider].model,
          messages: [{ role: 'user', content: TEST_PROMPTS[provider].prompt }],
          max_tokens: 50,
        };
        break;

      case 'Anthropic':
        headers['x-api-key'] = apiKey;
        headers['anthropic-version'] = '2023-06-01';
        body = {
          model: modelName || TEST_PROMPTS[provider].model,
          messages: [{ role: 'user', content: TEST_PROMPTS[provider].prompt }],
          max_tokens: 50,
        };
        break;

      case 'Google Gemini':
        endpoint = `${endpoint}/${modelName || TEST_PROMPTS[provider].model}:generateContent?key=${apiKey}`;
        body = {
          contents: [{ parts: [{ text: TEST_PROMPTS[provider].prompt }] }],
        };
        break;

      default:
        throw new Error('Unsupported provider');
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    
    // Validate response structure based on provider
    switch (provider) {
      case 'OpenAI':
      case 'OpenAI Compatible':
        if (!data.choices?.[0]?.message) {
          throw new Error('Invalid response format');
        }
        break;

      case 'Anthropic':
        if (!data.content?.[0]?.text) {
          throw new Error('Invalid response format');
        }
        break;

      case 'Google Gemini':
        if (!data.candidates?.[0]?.content) {
          throw new Error('Invalid response format');
        }
        break;
    }

    return { success: true };
  } catch (error) {
    console.error('Connection test failed:', error);
    return {
      success: false,
      error: error.message || 'Connection test failed',
    };
  }
}

export function getDefaultModel(provider) {
  return TEST_PROMPTS[provider]?.model || '';
}
