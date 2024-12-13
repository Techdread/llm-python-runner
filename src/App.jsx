import React, { useState, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import Output from './components/Output';
import LiteGraph from './components/LiteGraph';
import config from './config.json';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkPyodide = () => {
      if (window.pyodide) {
        setOutput('Python environment initialized successfully!');
      } else {
        setError('Python environment not yet initialized. Please wait...');
        setTimeout(checkPyodide, 1000);
      }
    };
    checkPyodide();
  }, []);

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(config.llmApi.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.llmApi.apiKey}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from LLM API');
      }

      const data = await response.json();
      setCode(data.code);
      setOutput('Code generated successfully! You can now edit and run it.');
    } catch (error) {
      console.error('Failed to get code from LLM:', error);
      setError('Failed to generate code from prompt: ' + error.message);
    }
    setLoading(false);
  };

  const executeCode = async () => {
    if (!window.pyodide) {
      setError('Python environment not initialized');
      return;
    }

    if (!code.trim()) {
      setError('No code to execute');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Create a new output stream to capture print statements
      window.pyodide.runPython(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `);

      // Run the user's code
      const result = await window.pyodide.runPythonAsync(code);
      
      // Get any printed output
      const stdout = window.pyodide.runPython("sys.stdout.getvalue()");
      
      // Combine the result and any printed output
      const output = stdout ? stdout + "\n" + String(result) : String(result);
      setOutput(output);
    } catch (error) {
      setError(`Error executing code: ${error.message}`);
    } finally {
      // Restore the original stdout
      window.pyodide.runPython("sys.stdout = sys.__stdout__");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <header className="bg-white rounded-lg p-4 shadow">
          <h1 className="text-3xl font-bold text-gray-800">LLM-Driven Python Runner</h1>
          <p className="text-gray-600 mt-2">Generate and execute Python code using LLM</p>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow">
              <h2 className="text-xl font-bold mb-4">Prompt</h2>
              <textarea
                className="w-full h-32 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here... (e.g., 'Write a Python program that calculates the factorial of a number')"
                disabled={loading}
              />
              <button
                className={`mt-2 px-4 py-2 rounded text-white w-full ${
                  loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={handlePromptSubmit}
                disabled={loading}
              >
                {loading ? 'Generating Code...' : 'Generate Code'}
              </button>
            </div>

            <ErrorBoundary>
              <CodeEditor code={code} onChange={setCode} />
            </ErrorBoundary>
            
            <button
              className={`w-full px-4 py-2 rounded text-white ${
                loading || !code
                  ? 'bg-green-400'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              onClick={executeCode}
              disabled={loading || !code}
            >
              {loading ? 'Executing...' : 'Run Code'}
            </button>
          </div>

          <div className="space-y-4">
            <Output output={output} />
            <ErrorBoundary>
              <LiteGraph />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
