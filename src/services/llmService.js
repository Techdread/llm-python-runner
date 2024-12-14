import { GoogleGenerativeAI } from '@google/generative-ai';
import { formatCode, extractPythonCode } from '../utils/codeFormatting';

const PROVIDER_ENDPOINTS = {
  OpenAI: 'https://api.openai.com/v1/chat/completions',
  Anthropic: 'https://api.anthropic.com/v1/messages',
  'OpenAI Compatible': '', // Will be set from baseUrl
};

const DEFAULT_SYSTEM_PROMPT = `You are a Python code generator. Generate clean, efficient, and well-documented Python code based on the user's request. Include comments explaining the code and any necessary imports. Only respond with the code, no additional explanations.`;

function formatPromptForProvider(prompt, provider) {
  switch (provider) {
    case 'OpenAI':
    case 'OpenAI Compatible':
      return {
        messages: [
          { role: 'system', content: DEFAULT_SYSTEM_PROMPT },
          { role: 'user', content: `Generate Python code for: ${prompt}` }
        ],
      };

    case 'Anthropic':
      return {
        messages: [
          { role: 'user', content: `${DEFAULT_SYSTEM_PROMPT}\nGenerate Python code for: ${prompt}` }
        ],
      };

    default:
      throw new Error('Unsupported provider');
  }
}

function extractCodeFromResponse(data, provider) {
  try {
    let rawCode;
    switch (provider) {
      case 'OpenAI':
      case 'OpenAI Compatible':
        rawCode = data.choices[0].message.content.trim();
        break;

      case 'Anthropic':
        rawCode = data.content[0].text.trim();
        break;

      case 'Google Gemini':
        rawCode = data;
        break;

      default:
        throw new Error('Unsupported provider');
    }

    // First try to extract Python code if the response contains explanations
    let code = extractPythonCode(rawCode);
    
    // Then format the code and remove any remaining markers
    return formatCode(code, provider);
  } catch (error) {
    console.error('Error extracting code from response:', error);
    throw new Error('Invalid response format from provider');
  }
}

async function generateGeminiPrompt({ description, systemPrompt, apiKey, modelName, onStream }) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName || 'gemini-pro' });

  const prompt = `${systemPrompt}\n\n${description}`;

  try {
    if (onStream) {
      const result = await model.generateContentStream(prompt);
      let buffer = '';
      
      for await (const chunk of result.stream) {
        const text = chunk.text();
        buffer += text;
        onStream(buffer);
      }
      
      return buffer;
    } else {
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (error) {
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

export async function generateCode(prompt, config) {
  const { provider, apiKey, modelName, baseUrl } = config;
  
  // Handle Gemini separately using the Google AI SDK
  if (provider === 'Google Gemini') {
    const response = await generateGeminiPrompt({
      description: prompt,
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      apiKey,
      modelName,
    });
    return formatCode(response, provider);
  }

  let endpoint = PROVIDER_ENDPOINTS[provider];
  if (provider === 'OpenAI Compatible') {
    endpoint = `${baseUrl}/chat/completions`;
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  // Add provider-specific headers
  switch (provider) {
    case 'OpenAI':
    case 'OpenAI Compatible':
      headers['Authorization'] = `Bearer ${apiKey}`;
      break;
    case 'Anthropic':
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      break;
  }

  const body = {
    ...formatPromptForProvider(prompt, provider),
    ...(provider === 'OpenAI' || provider === 'OpenAI Compatible' ? {
      model: modelName,
      max_tokens: 2000,
    } : {}),
    ...(provider === 'Anthropic' ? {
      model: modelName,
      max_tokens: 2000,
    } : {}),
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return extractCodeFromResponse(data, provider);
  } catch (error) {
    console.error('Error generating code:', error);
    throw new Error(`Failed to generate code: ${error.message}`);
  }
}
