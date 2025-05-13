import React, { useEffect } from 'react';
import { useConfig, client } from '@sigmacomputing/plugin';
import { Box, Typography } from '@mui/material';

const ForecastConfig = () => {
  // Configure the editor panel when the component mounts
  useEffect(() => {
    client.config.configureEditorPanel([
      {
        name: 'dataSource',
        type: 'element',
        label: 'Select Data Source'
      },
      {
        name: 'dateColumn',
        type: 'column',
        source: 'dataSource',
        label: 'Select Date Column'
      },
      {
        name: 'valueColumn',
        type: 'column',
        source: 'dataSource',
        label: 'Select Value Column'
      }
    ]);

    // Subscribe to configuration changes
    const unsubscribe = client.config.onConfigChange((newConfig) => {
      // The parent component will automatically receive updates through useConfig()
      console.log('Configuration updated:', newConfig);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Get the current configuration
  const config = useConfig();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Configuration
      </Typography>
      {!config?.dataSource && (
        <Typography variant="body2" color="text.secondary">
          Please select a data source in the editor panel
        </Typography>
      )}
      {config?.dataSource && !config?.dateColumn && (
        <Typography variant="body2" color="text.secondary">
          Please select a date column in the editor panel
        </Typography>
      )}
      {config?.dataSource && !config?.valueColumn && (
        <Typography variant="body2" color="text.secondary">
          Please select a value column in the editor panel
        </Typography>
      )}
    </Box>
  );
};

export default ForecastConfig; 