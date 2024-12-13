import React from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ code, onChange }) {
  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-xl font-bold mb-4">Code Editor</h2>
      <div className="border rounded overflow-hidden">
        <Editor
          height="300px"
          defaultLanguage="python"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
