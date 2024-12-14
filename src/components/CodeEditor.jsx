import React from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ code, onChange }) {
  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
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
