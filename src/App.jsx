import React, { useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CodeEditorPage from './pages/CodeEditorPage';
import VisualEditorPage from './pages/VisualEditorPage';
import { ThemeProvider } from './context/ThemeContext';
import { LLMProvider } from './context/LLMContext';
import { lightTheme, darkTheme } from './theme';
import { useThemeMode } from './context/ThemeContext';
import { useLLM } from './context/LLMContext';
import { generateCode } from './services/llmService';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function ThemedApp() {
  const { isDarkMode } = useThemeMode();
  const { config } = useLLM();
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

    if (!config) {
      setError('Please configure an LLM provider in settings first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const generatedCode = await generateCode(prompt, config);
      setCode(generatedCode);
      setOutput('Code generated successfully! You can now edit and run it.');
    } catch (error) {
      console.error('Failed to generate code:', error);
      setError('Failed to generate code: ' + error.message);
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
      window.pyodide.runPython(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `);

      const result = await window.pyodide.runPythonAsync(code);
      const stdout = window.pyodide.runPython("sys.stdout.getvalue()");
      const output = stdout ? stdout + "\n" + String(result) : String(result);
      setOutput(output);
    } catch (error) {
      setError(`Error executing code: ${error.message}`);
    } finally {
      window.pyodide.runPython("sys.stdout = sys.__stdout__");
      setLoading(false);
    }
  };

  return (
    <MuiThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={
              <CodeEditorPage
                code={code}
                setCode={setCode}
                prompt={prompt}
                setPrompt={setPrompt}
                output={output}
                loading={loading}
                error={error}
                handlePromptSubmit={handlePromptSubmit}
                executeCode={executeCode}
              />
            } />
            <Route path="visual-editor" element={<VisualEditorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LLMProvider>
        <ThemedApp />
      </LLMProvider>
    </ThemeProvider>
  );
}

export default App;
