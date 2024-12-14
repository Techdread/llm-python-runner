import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Alert,
  FormHelperText,
  Paper,
  CircularProgress,
  Collapse,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  Visibility,
  VisibilityOff,
  Help as HelpIcon,
} from '@mui/icons-material';
import { testConnection, getDefaultModel } from '../../utils/llmProviders';
import { validateApiKey, getApiKeyFormat } from '../../utils/apiKeyValidation';

const LLM_PROVIDERS = [
  'OpenAI',
  'Anthropic',
  'Google Gemini',
  'OpenAI Compatible',
];

export default function ProviderSelector({ initialProvider, onProviderSelected, onClose }) {
  const [provider, setProvider] = useState(LLM_PROVIDERS[0]);
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testing, setTesting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState('');

  useEffect(() => {
    if (initialProvider) {
      setProvider(initialProvider.provider || LLM_PROVIDERS[0]);
      setApiKey(initialProvider.apiKey || '');
      setModelName(initialProvider.modelName || '');
      setBaseUrl(initialProvider.baseUrl || '');
    }
  }, [initialProvider]);

  useEffect(() => {
    // Set default model when provider changes
    setModelName(getDefaultModel(provider));
    // Clear API key error when provider changes
    setApiKeyError('');
    setError('');
    setSuccess('');
  }, [provider]);

  const handleProviderChange = (event) => {
    setProvider(event.target.value);
  };

  const handleApiKeyChange = (event) => {
    const newApiKey = event.target.value;
    setApiKey(newApiKey);
    
    if (newApiKey) {
      const validation = validateApiKey(provider, newApiKey);
      setApiKeyError(validation.isValid ? '' : validation.error);
    } else {
      setApiKeyError('');
    }
  };

  const handleTestConnection = async () => {
    const validation = validateApiKey(provider, apiKey);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setTesting(true);
    setError('');
    setSuccess('');

    const config = {
      provider,
      apiKey,
      modelName,
      baseUrl: provider === 'OpenAI Compatible' ? baseUrl : undefined,
    };

    const result = await testConnection(config);
    
    if (result.success) {
      setSuccess('Connection test successful!');
    } else {
      setError(result.error);
    }
    
    setTesting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateApiKey(provider, apiKey);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    try {
      const config = {
        provider,
        apiKey,
        modelName,
        baseUrl: provider === 'OpenAI Compatible' ? baseUrl : undefined,
      };
      
      onProviderSelected(config);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const isFormValid = () => {
    return (
      provider &&
      apiKey &&
      !apiKeyError &&
      modelName &&
      (provider !== 'OpenAI Compatible' || baseUrl)
    );
  };

  const apiKeyFormat = getApiKeyFormat(provider);

  return (
    <Paper elevation={0}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="provider-label">LLM Provider</InputLabel>
          <Select
            labelId="provider-label"
            value={provider}
            label="LLM Provider"
            onChange={handleProviderChange}
          >
            {LLM_PROVIDERS.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <TextField
            label="API Key"
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={handleApiKeyChange}
            error={Boolean(apiKeyError)}
            helperText={apiKeyError}
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={`Format: ${apiKeyFormat.description}\nExample: ${apiKeyFormat.example}`}>
                    <IconButton edge="end" size="small">
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    onClick={() => setShowApiKey(!showApiKey)}
                    edge="end"
                  >
                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Model Name"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            required
            fullWidth
            helperText="Leave empty to use default model"
          />
        </Box>

        {provider === 'OpenAI Compatible' && (
          <TextField
            label="Base URL"
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://localhost:1234/v1"
            required
            fullWidth
            sx={{ mb: 2 }}
            helperText="Enter the base URL of your OpenAI-compatible API (e.g., LMStudio, LocalAI)"
          />
        )}

        <Collapse in={Boolean(error || success)} sx={{ mb: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
        </Collapse>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton
            onClick={handleTestConnection}
            loading={testing}
            disabled={!isFormValid()}
            variant="outlined"
          >
            Test Connection
          </LoadingButton>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid()}
          >
            Save Settings
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
