import React, { createContext, useContext, useState, useEffect } from 'react';

const LLMContext = createContext();

export function LLMProvider({ children }) {
  const [config, setConfig] = useState(() => {
    const savedConfig = localStorage.getItem('llm-provider-config');
    return savedConfig ? JSON.parse(savedConfig) : null;
  });

  useEffect(() => {
    if (config) {
      localStorage.setItem('llm-provider-config', JSON.stringify(config));
    }
  }, [config]);

  const updateConfig = (newConfig) => {
    setConfig(newConfig);
  };

  return (
    <LLMContext.Provider value={{ config, updateConfig }}>
      {children}
    </LLMContext.Provider>
  );
}

export function useLLM() {
  const context = useContext(LLMContext);
  if (context === undefined) {
    throw new Error('useLLM must be used within a LLMProvider');
  }
  return context;
}
