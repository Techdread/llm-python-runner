/**
 * Common code block markers used by different LLMs
 */
const CODE_BLOCK_MARKERS = {
  TRIPLE_BACKTICKS: {
    start: '```',
    end: '```',
  },
  PYTHON_BLOCK: {
    start: '```python',
    end: '```',
  },
  XML_BLOCK: {
    start: '<code>',
    end: '</code>',
  },
};

/**
 * Removes code block markers and unnecessary whitespace
 * @param {string} code - The code string to clean
 * @returns {string} - Cleaned code string
 */
function removeCodeBlockMarkers(code) {
  if (!code) return '';

  let cleanedCode = code;

  // First remove Python-specific markers
  cleanedCode = cleanedCode.replace(/^```python\n/gm, '');
  cleanedCode = cleanedCode.replace(/^```\n/gm, '');
  cleanedCode = cleanedCode.replace(/```$/gm, '');
  
  // Remove XML-style code tags
  cleanedCode = cleanedCode.replace(/<code>|<\/code>/g, '');

  // Remove any remaining backtick blocks
  cleanedCode = cleanedCode.replace(/^```\w*\n/gm, '');
  cleanedCode = cleanedCode.replace(/\n```$/gm, '');

  return cleanedCode;
}

/**
 * Removes language tags like "python" or "py" after code block markers
 * @param {string} code - The code string to clean
 * @returns {string} - Code string without language tags
 */
function removeLanguageTags(code) {
  if (!code) return '';

  // Remove language identifier after triple backticks
  let cleanedCode = code.replace(/```\w+\n/g, '');
  
  // Remove standalone language tags
  cleanedCode = cleanedCode.replace(/^python\s*$/gm, '');
  cleanedCode = cleanedCode.replace(/^python:\s*/gm, '');
  
  return cleanedCode;
}

/**
 * Normalizes line endings to use consistent style
 * @param {string} code - The code string to normalize
 * @returns {string} - Code string with normalized line endings
 */
function normalizeLineEndings(code) {
  if (!code) return '';
  
  // Convert all line endings to \n
  return code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Removes extra blank lines at the start and end of the code
 * @param {string} code - The code string to trim
 * @returns {string} - Trimmed code string
 */
function trimExtraLines(code) {
  if (!code) return '';
  
  // Remove extra blank lines at start and end
  return code.trim().replace(/^\n+|\n+$/g, '');
}

/**
 * Main function to format and clean code from LLM responses
 * @param {string} code - The raw code from LLM
 * @param {string} provider - The LLM provider name
 * @returns {string} - Formatted and cleaned code
 */
export function formatCode(code, provider) {
  if (!code) return '';
  console.log('Input code:', code);
  
  let formattedCode = code;

  // Apply general formatting
  formattedCode = normalizeLineEndings(formattedCode);
  formattedCode = removeLanguageTags(formattedCode);
  formattedCode = removeCodeBlockMarkers(formattedCode);
  formattedCode = trimExtraLines(formattedCode);

  // Apply provider-specific formatting
  switch (provider) {
    case 'OpenAI':
    case 'OpenAI Compatible':
      // Remove any "Here's the Python code:" type prefixes
      formattedCode = formattedCode.replace(/^(?:Here['']s\s+(?:the|a)\s+)?Python\s+code[^:]*:\s*/i, '');
      break;

    case 'Anthropic':
      // Remove "Here's a Python program..." type prefixes
      formattedCode = formattedCode.replace(/^Here['']s\s+(?:a|the)\s+(?:Python\s+)?(?:program|code)[^:]*:\s*/i, '');
      break;

    case 'Google Gemini':
      // Remove any Gemini-specific markers or prefixes
      formattedCode = formattedCode.replace(/^Here['']s\s+(?:a|the)\s+(?:Python\s+)?(?:program|code)[^:]*:\s*/i, '');
      // Remove any "python" tags that might appear alone on a line
      formattedCode = formattedCode.replace(/^python\s*$/gm, '');
      break;

    default:
      // Default formatting
      break;
  }

  return formattedCode;
}

/**
 * Extracts Python code from a larger text that might contain explanations
 * @param {string} text - The full text response
 * @returns {string} - Extracted Python code
 */
export function extractPythonCode(text) {
  if (!text) return '';

  // First try to find code blocks with Python marker
  const pythonBlockRegex = /```python\n([\s\S]*?)```/;
  const pythonMatch = text.match(pythonBlockRegex);
  if (pythonMatch) {
    return pythonMatch[1].trim();
  }

  // Then try to find any code blocks
  const codeBlockRegex = /```\n?([\s\S]*?)```/;
  const match = text.match(codeBlockRegex);
  if (match) {
    return match[1].trim();
  }

  // If no code blocks found, try to extract based on Python syntax
  const lines = text.split('\n');
  const codeLines = lines.filter(line => {
    const trimmedLine = line.trim();
    return (
      trimmedLine.startsWith('import ') ||
      trimmedLine.startsWith('from ') ||
      trimmedLine.startsWith('def ') ||
      trimmedLine.startsWith('class ') ||
      trimmedLine.includes(' = ') ||
      trimmedLine.startsWith('print(') ||
      trimmedLine.startsWith('#') ||
      trimmedLine.startsWith('if ') ||
      trimmedLine.startsWith('for ') ||
      trimmedLine.startsWith('while ') ||
      trimmedLine.startsWith('try:') ||
      trimmedLine.startsWith('except:') ||
      trimmedLine.startsWith('finally:') ||
      trimmedLine.startsWith('with ') ||
      trimmedLine.startsWith('async ') ||
      trimmedLine.startsWith('await ')
    );
  });

  return codeLines.length > 0 ? codeLines.join('\n') : text;
}
