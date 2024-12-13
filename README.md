# LLM Python Runner

A web-based visual programming interface that allows you to generate and execute Python code using Large Language Models (LLM) and Pyodide. Built with Vite, React, and LiteGraph.js.

## Features

- 🤖 LLM-powered Python code generation
- 🎨 Visual programming interface using LiteGraph.js
- 🐍 In-browser Python execution with Pyodide
- 📝 Monaco-based code editor
- 🔄 Real-time code execution and output display

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vite-llm-python-runner.git
cd vite-llm-python-runner
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Create a configuration file:
```bash
cp config.json.example config.json
```
Edit `config.json` and add your LLM API credentials:
```json
{
  "llmApi": {
    "endpoint": "YOUR_LLM_API_ENDPOINT",
    "apiKey": "YOUR_API_KEY"
  }
}
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
vite-llm-python-runner/
├── src/
│   ├── components/
│   │   ├── CodeEditor.jsx    # Monaco-based code editor
│   │   ├── LiteGraph.jsx     # Visual programming interface
│   │   ├── Output.jsx        # Code execution output display
│   │   └── ErrorBoundary.jsx # React error boundary component
│   ├── App.jsx              # Main application component
│   ├── main.jsx            # Application entry point
│   └── index.css          # Global styles
├── public/               # Static assets
├── index.html           # HTML entry point
├── package.json         # Project dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # Project documentation
```

## Usage

1. Enter a natural language prompt describing the Python code you want to generate
2. Click "Generate Code" to use the LLM to create the code
3. Edit the generated code in the Monaco editor if needed
4. Click "Run Code" to execute the Python code in the browser
5. View the output in the output panel
6. Use the visual programming interface to create more complex workflows

## Development

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Technologies Used

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Pyodide](https://pyodide.org/) - Python with the scientific stack, compiled to WebAssembly
- [LiteGraph.js](https://github.com/jagenjo/litegraph.js) - A graph node engine and editor
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The code editor that powers VS Code
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Pyodide team for making Python available in the browser
- Thanks to the LiteGraph.js team for the visual programming framework
- Thanks to all contributors and users of this project
