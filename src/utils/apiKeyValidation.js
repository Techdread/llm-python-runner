// API key format patterns
const API_KEY_PATTERNS = {
  OpenAI: {
    pattern: /^sk-[a-zA-Z0-9]{32,}$/,
    example: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: 'Must start with "sk-" followed by at least 32 characters',
  },
  Anthropic: {
    pattern: /^sk-ant-[a-zA-Z0-9]{32,}$/,
    example: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: 'Must start with "sk-ant-" followed by at least 32 characters',
  },
  'Google Gemini': {
    pattern: /^[a-zA-Z0-9_-]{39}$/,
    example: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    description: 'Must be exactly 39 characters long',
  },
  'OpenAI Compatible': {
    pattern: /^.{8,}$/,
    example: 'your-api-key',
    description: 'Must be at least 8 characters long',
  },
};

/**
 * Validates an API key for a specific provider
 * @param {string} provider - The LLM provider name
 * @param {string} apiKey - The API key to validate
 * @returns {Object} - Validation result
 */
export function validateApiKey(provider, apiKey) {
  const providerPattern = API_KEY_PATTERNS[provider];
  
  if (!providerPattern) {
    return {
      isValid: false,
      error: 'Unknown provider',
    };
  }

  if (!apiKey) {
    return {
      isValid: false,
      error: 'API key is required',
    };
  }

  const isValid = providerPattern.pattern.test(apiKey);

  if (!isValid) {
    return {
      isValid: false,
      error: `Invalid API key format. ${providerPattern.description}`,
      example: providerPattern.example,
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Gets the API key format description for a provider
 * @param {string} provider - The LLM provider name
 * @returns {Object} - Provider's API key format information
 */
export function getApiKeyFormat(provider) {
  return API_KEY_PATTERNS[provider] || {
    description: 'No specific format required',
    example: 'your-api-key',
  };
}
