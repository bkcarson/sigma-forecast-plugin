import React, { useEffect, useState } from 'react';
import { useConfig, useElementData, useElementColumns } from '@sigmacomputing/plugin';
import { Box, Container, Typography } from '@mui/material';
import ForecastChart from './components/ForecastChart';
import ForecastControls from './components/ForecastControls';
import ForecastConfig from './components/ForecastConfig';
import { processTimeSeriesData, generateForecast } from './utils/forecasting';

function App() {
  // Get configuration from Sigma
  const config = useConfig();
  
  // Get data source element ID from config
  const dataSourceId = config?.dataSource;
  
  // Get columns and data from the selected data source
  const columns = useElementColumns(dataSourceId);
  const data = useElementData(dataSourceId);

  // State for forecast settings
  const [forecastSettings, setForecastSettings] = useState({
    forecastPeriods: 5,
    dateColumn: config?.dateColumn,
    valueColumn: config?.valueColumn
  });

  // State for processed data
  const [processedData, setProcessedData] = useState({
    historical: [],
    forecast: []
  });

  // Update processed data when config or data changes
  useEffect(() => {
    if (data && columns && forecastSettings.dateColumn && forecastSettings.valueColumn) {
      // Process the time series data
      const { historical, forecast } = processTimeSeriesData(
        data,
        forecastSettings.dateColumn,
        forecastSettings.valueColumn
      );

      // Generate new forecast with updated periods
      const newForecast = generateForecast(historical, forecastSettings.forecastPeriods);

      setProcessedData({
        historical,
        forecast: newForecast
      });
    }
  }, [data, columns, forecastSettings]);

  // Handle forecast period changes
  const handleForecastPeriodChange = (periods) => {
    setForecastSettings(prev => ({
      ...prev,
      forecastPeriods: periods
    }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Sigma Forecast Plugin
        </Typography>
        
        {/* Configuration Panel */}
        <ForecastConfig />

        {/* Forecast Controls */}
        <ForecastControls
          forecastPeriods={forecastSettings.forecastPeriods}
          onForecastPeriodChange={handleForecastPeriodChange}
        />

        {/* Forecast Chart */}
        <ForecastChart
          data={processedData}
          dateColumn={forecastSettings.dateColumn}
          valueColumn={forecastSettings.valueColumn}
        />
      </Box>
    </Container>
  );
}

export default App; 