import { useEffect } from 'react';
import { useConfig, client } from '@sigmacomputing/plugin';

const ForecastConfig = () => {
  // Configure the editor panel when the component mounts
  useEffect(() => {
    console.log('Setting up editor panel configuration');
    try {
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
        },
        {
          name: 'modelType',
          type: 'dropdown',
          label: 'Model Type',
          values: ['additive', 'multiplicative'],
          defaultValue: 'additive'
        },
        {
          name: 'seasonality',
          type: 'dropdown',
          label: 'Seasonality',
          values: [
            'None (1)',
            'Daily (7)',
            'Weekly (7)',
            'Monthly (12)'
          ],
          defaultValue: 'Weekly (7)'
        },
        {
          name: 'forecastPeriods',
          type: 'dropdown',
          label: 'Forecast Periods',
          values: Array.from({ length: 30 }, (_, i) => (i + 1).toString()),
          defaultValue: '5'
        }
      ]);
      console.log('Editor panel configuration completed');
    } catch (error) {
      console.error('Error configuring editor panel:', error);
    }
  }, []);

  // Get the current configuration
  const config = useConfig();
  console.log('ForecastConfig current config:', {
    hasDataSource: !!config?.dataSource,
    hasDateColumn: !!config?.dateColumn,
    hasValueColumn: !!config?.valueColumn
  });

  return (
    null
  );
};

export default ForecastConfig; 