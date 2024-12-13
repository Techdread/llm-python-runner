import React, { useEffect, useRef, useState } from 'react';
import { LGraph, LGraphCanvas, LiteGraph } from 'litegraph.js';
import 'litegraph.js/css/litegraph.css';
import '../litegraph.css';

function LiteGraphComponent() {
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Initialize LiteGraph
      const graph = new LGraph();

      // Create canvas instance
      const graphCanvas = new LGraphCanvas(canvas, graph);
      
      // Set canvas size
      const resizeCanvas = () => {
        const width = canvas.parentElement.clientWidth;
        const height = 400;
        canvas.width = width;
        canvas.height = height;
        graphCanvas.resize(width, height);
      };

      // Initial resize
      resizeCanvas();
      
      // Handle window resize
      window.addEventListener('resize', resizeCanvas);

      // Register node types
      class PythonPromptNode {
        constructor() {
          this.addOutput("prompt", "string");
          this.addProperty("prompt", "");
          this.size = [200, 60];
          this.title = "Python Prompt";
        }

        onExecute() {
          this.setOutputData(0, this.properties.prompt);
        }
      }

      class ExecutePythonNode {
        constructor() {
          this.addInput("code", "string");
          this.addOutput("result", "string");
          this.size = [200, 60];
          this.title = "Execute Python";
        }

        onExecute() {
          const code = this.getInputData(0);
          if (code) {
            this.setOutputData(0, code);
          }
        }
      }

      // Register nodes
      LiteGraph.registerNodeType("custom/PythonPrompt", PythonPromptNode);
      LiteGraph.registerNodeType("custom/ExecutePython", ExecutePythonNode);

      // Add default nodes
      const promptNode = LiteGraph.createNode("custom/PythonPrompt");
      promptNode.pos = [200, 200];
      graph.add(promptNode);

      const executeNode = LiteGraph.createNode("custom/ExecutePython");
      executeNode.pos = [500, 200];
      graph.add(executeNode);

      // Connect nodes
      promptNode.connect(0, executeNode, 0);

      // Start graph
      graph.start();

      // Cleanup
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        graph.stop();
        graph.clear();
      };
    } catch (err) {
      console.error('Error initializing LiteGraph:', err);
      setError('Failed to initialize visual programming interface: ' + err.message);
    }
  }, []);

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-xl font-bold mb-4">Visual Programming</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-xl font-bold mb-4">Visual Programming</h2>
      <div style={{ height: '400px', position: 'relative', border: '1px solid #ccc', borderRadius: '4px' }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#333',
            borderRadius: '4px'
          }}
        />
      </div>
    </div>
  );
}

export default LiteGraphComponent;
