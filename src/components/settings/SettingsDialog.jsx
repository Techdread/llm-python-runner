import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tab,
  Tabs,
  Box,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import ProviderSelector from './ProviderSelector';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function SettingsDialog({ open, onClose, initialProvider, onProviderSelected }) {
  const [tabValue, setTabValue] = React.useState(0);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Settings
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="settings tabs"
        sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
      >
        <Tab label="LLM Provider" />
        <Tab label="Editor Settings" />
        <Tab label="Visual Editor" />
      </Tabs>

      <DialogContent dividers>
        <TabPanel value={tabValue} index={0}>
          <ProviderSelector
            initialProvider={initialProvider}
            onProviderSelected={onProviderSelected}
            onClose={onClose}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          Editor settings coming soon...
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          Visual editor settings coming soon...
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
