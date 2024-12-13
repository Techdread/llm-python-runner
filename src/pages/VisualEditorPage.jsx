import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import LiteGraph from '../components/LiteGraph';

export default function VisualEditorPage() {
  return (
    <Box sx={{ height: 'calc(100vh - 100px)' }}>
      <Paper 
        sx={{ 
          p: 3, 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h5" gutterBottom>
          Visual Programming Editor
        </Typography>
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <LiteGraph />
        </Box>
      </Paper>
    </Box>
  );
}
