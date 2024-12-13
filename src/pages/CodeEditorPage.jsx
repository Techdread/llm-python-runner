import React from 'react';
import { Box, Paper, Typography, TextField, Button, Grid } from '@mui/material';
import CodeEditor from '../components/CodeEditor';
import Output from '../components/Output';

export default function CodeEditorPage({ 
  code, 
  setCode, 
  prompt, 
  setPrompt, 
  output, 
  loading, 
  error, 
  handlePromptSubmit, 
  executeCode 
}) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Generate Python Code
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here... (e.g., 'Write a Python program that calculates the factorial of a number')"
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handlePromptSubmit}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Generating Code...' : 'Generate Code'}
          </Button>
        </Paper>
      </Grid>

      {error && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
            <Typography>{error}</Typography>
          </Paper>
        </Grid>
      )}

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Code Editor
          </Typography>
          <Box sx={{ height: 400, mb: 2 }}>
            <CodeEditor code={code} onChange={setCode} />
          </Box>
          <Button
            variant="contained"
            color="success"
            onClick={executeCode}
            disabled={loading || !code}
            fullWidth
          >
            {loading ? 'Executing...' : 'Run Code'}
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Output
          </Typography>
          <Output output={output} />
        </Paper>
      </Grid>
    </Grid>
  );
}
