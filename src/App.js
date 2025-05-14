import React, { useEffect, useState } from 'react';
import { useConfig, useElementData, useElementColumns } from '@sigmacomputing/plugin';
import { Box, Container, Typography } from '@mui/material';
import ForecastChart from './components/ForecastChart';
import ForecastControls from './components/ForecastControls';
import ForecastConfig from './components/ForecastConfig';
import { processTimeSeriesData } from './utils/forecasting';

function App() {
  // Get configuration from Sigma
  const config = useConfig();
  console.log('Current config:', config);
  
  // Get data source element ID from config
  const dataSourceId = config?.dataSource;
  console.log('Data source ID:', dataSourceId);
  
  // Get columns and data from the selected data source
  const columns = useElementColumns(dataSourceId);
  const data = useElementData(dataSourceId);
  console.log('Columns:', columns);
  console.log('Data sample:', Array.isArray(data) ? data.slice(0, 2) : data);

  // State for forecast settings
  const [forecastSettings, setForecastSettings] = useState({
    forecastPeriods: 5,
    dateColumn: config?.dateColumn,
    valueColumn: config?.valueColumn,
    alpha: 0.3,
    beta: 0.1,
    gamma: 0,
    seasonLength: 0
  });
  console.log('Forecast settings:', forecastSettings);

  // State for processed data
  const [processedData, setProcessedData] = useState({
    historical: [],
    forecast: []
  });

  // Update processed data when config or data changes
  useEffect(() => {
    if (data && columns && forecastSettings.dateColumn && forecastSettings.valueColumn) {
      const result = processTimeSeriesData(
        data,
        forecastSettings.dateColumn,
        forecastSettings.valueColumn,
        forecastSettings.forecastPeriods,
        forecastSettings.alpha,
        forecastSettings.beta,
        forecastSettings.gamma,
        forecastSettings.seasonLength
      );
      setProcessedData(result);
    } else {
      setProcessedData({ historical: [], forecast: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, columns, forecastSettings]);

  // Handle forecast period changes
  const handleForecastPeriodChange = (periods) => {
    setForecastSettings(prev => ({
      ...prev,
      forecastPeriods: periods
    }));
  };

  const handleAlphaChange = (alpha) => {
    setForecastSettings(prev => ({ ...prev, alpha }));
  };

  const handleBetaChange = (beta) => {
    setForecastSettings(prev => ({ ...prev, beta }));
  };

  const handleGammaChange = (gamma) => {
    setForecastSettings(prev => ({ ...prev, gamma }));
  };

  const handleSeasonLengthChange = (seasonLength) => {
    setForecastSettings(prev => ({ ...prev, seasonLength }));
  };

  // Check config completeness
  const isConfigComplete =
    !!dataSourceId && !!config?.dateColumn && !!config?.valueColumn;

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

        {/* Only show controls/chart if config is complete */}
        {isConfigComplete && (
          <>
            <ForecastControls
              forecastPeriods={forecastSettings.forecastPeriods}
              alpha={forecastSettings.alpha}
              beta={forecastSettings.beta}
              gamma={forecastSettings.gamma}
              seasonLength={forecastSettings.seasonLength}
              onForecastPeriodChange={handleForecastPeriodChange}
              onAlphaChange={handleAlphaChange}
              onBetaChange={handleBetaChange}
              onGammaChange={handleGammaChange}
              onSeasonLengthChange={handleSeasonLengthChange}
            />
            <ForecastChart
              data={processedData}
              dateColumn={forecastSettings.dateColumn}
              valueColumn={forecastSettings.valueColumn}
            />
          </>
        )}
      </Box>
    </Container>
  );
}

export default App; 