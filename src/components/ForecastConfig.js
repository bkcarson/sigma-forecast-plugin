import React, { useEffect } from 'react';
import { useConfig, client } from '@sigmacomputing/plugin';
import { Box, Typography } from '@mui/material';

const ForecastConfig = () => {
  // Configure the editor panel when the component mounts
  useEffect(() => {
    console.log('Setting up editor panel configuration');
    
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
    ]).then(() => {
      console.log('Editor panel configuration completed');
    }).catch(error => {
      console.error('Error configuring editor panel:', error);
    });

    // Subscribe to configuration changes
    const unsubscribe = client.config.onConfigChange((newConfig) => {
      console.log('Configuration updated:', {
        hasDataSource: !!newConfig?.dataSource,
        hasDateColumn: !!newConfig?.dateColumn,
        hasValueColumn: !!newConfig?.valueColumn,
        fullConfig: newConfig
      });
    });

    return () => {
      console.log('Cleaning up ForecastConfig subscriptions');
      unsubscribe();
    };
  }, []);

  // Get the current configuration
  const config = useConfig();
  console.log('ForecastConfig current config:', {
    hasDataSource: !!config?.dataSource,
    hasDateColumn: !!config?.dateColumn,
    hasValueColumn: !!config?.valueColumn
  });

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