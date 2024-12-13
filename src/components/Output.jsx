import React from 'react';

function Output({ output }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-xl font-bold mb-4">Output</h2>
      <div className="bg-gray-900 text-green-400 p-4 rounded font-mono min-h-[200px] whitespace-pre-wrap overflow-auto">
        {output || 'No output yet...'}
      </div>
    </div>
  );
}

export default Output;
