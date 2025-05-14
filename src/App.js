import React, { useMemo } from 'react';
import { useConfig, useElementData, useElementColumns } from '@sigmacomputing/plugin';
import { Box, Container, Typography } from '@mui/material';
import ForecastChart from './components/ForecastChart';
import ForecastConfig from './components/ForecastConfig';
import { processTimeSeriesData } from './utils/forecasting';

function App() {
  // Get configuration from Sigma
  const config = useConfig();
  
  // Memoize seasonality mapping
  const seasonalityMap = useMemo(() => ({
    'None (1)': 1,
    'Daily (7)': 7,
    'Weekly (7)': 7,
    'Monthly (12)': 12
  }), []);

  // Memoize derived config values
  const { seasonLength, modelType, forecastPeriods, dataSourceId } = useMemo(() => ({
    seasonLength: seasonalityMap[config?.seasonality] || 7,
    modelType: config?.modelType || 'additive',
    forecastPeriods: parseInt(config?.forecastPeriods, 10) || 5,
    dataSourceId: config?.dataSource
  }), [config?.seasonality, config?.modelType, config?.forecastPeriods, config?.dataSource, seasonalityMap]);
  
  // Get columns and data from the selected data source
  const columns = useElementColumns(dataSourceId);
  const data = useElementData(dataSourceId);

  // Memoize processed data calculation
  const processedData = useMemo(() => {
    if (!data || !columns || !config?.dateColumn || !config?.valueColumn) {
      return { historical: [], forecast: [] };
    }

    return processTimeSeriesData(
      data,
      config.dateColumn,
      config.valueColumn,
      forecastPeriods,
      seasonLength,
      modelType
    );
  }, [data, columns, config?.dateColumn, config?.valueColumn, forecastPeriods, seasonLength, modelType]);

  // Memoize config completeness check
  const isConfigComplete = useMemo(() => 
    !!dataSourceId && !!config?.dateColumn && !!config?.valueColumn,
    [dataSourceId, config?.dateColumn, config?.valueColumn]
  );

  // Memoize chart component to prevent unnecessary re-renders
  const chartComponent = useMemo(() => {
    if (!isConfigComplete) return null;
    
    return (
      <ForecastChart
        data={processedData}
        dateColumn={config.dateColumn}
        valueColumn={config.valueColumn}
      />
    );
  }, [isConfigComplete, processedData, config?.dateColumn, config?.valueColumn]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Sigma Forecast Plugin
        </Typography>
        
        {/* Configuration Panel */}
        <ForecastConfig />

        {/* Show prompts if config is incomplete */}
        {!dataSourceId && (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Please select a data source in the editor panel.
          </Typography>
        )}
        {dataSourceId && !config?.dateColumn && (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Please select a date column in the editor panel.
          </Typography>
        )}
        {dataSourceId && config?.dateColumn && !config?.valueColumn && (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Please select a value column in the editor panel.
          </Typography>
        )}

        {/* Render memoized chart component */}
        {chartComponent}
      </Box>
    </Container>
  );
}

export default React.memo(App); 