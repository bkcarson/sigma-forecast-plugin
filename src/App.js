import React, { useMemo, useState, useCallback, useRef } from 'react';
import { useConfig, useElementData, useElementColumns } from '@sigmacomputing/plugin';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import ForecastChart from './components/ForecastChart';
import ForecastConfig from './components/ForecastConfig';
import { processTimeSeriesData, exportForecastDataToCSV } from './utils/forecasting';
import debounce from 'lodash/debounce';

function App() {
  // Get configuration from Sigma
  const config = useConfig();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState({ historical: [], forecast: [] });
  
  // Use refs to maintain stable references to state setters
  const setIsProcessingRef = useRef(setIsProcessing);
  const setProcessedDataRef = useRef(setProcessedData);
  
  // Update refs when state setters change
  React.useEffect(() => {
    setIsProcessingRef.current = setIsProcessing;
    setProcessedDataRef.current = setProcessedData;
  }, [setIsProcessing, setProcessedData]);

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

  // Create a stable debounced function that doesn't depend on state setters
  const debouncedProcessData = useMemo(
    () => debounce((newData, newColumns, newConfig, newForecastPeriods, newSeasonLength, newModelType) => {
      if (!newData || !newColumns || !newConfig?.dateColumn || !newConfig?.valueColumn) {
        setProcessedDataRef.current({ historical: [], forecast: [] });
        setIsProcessingRef.current(false);
        return;
      }

      const result = processTimeSeriesData(
        newData,
        newConfig.dateColumn,
        newConfig.valueColumn,
        newForecastPeriods,
        newSeasonLength,
        newModelType
      );
      setProcessedDataRef.current(result);
      setIsProcessingRef.current(false);
    }, 300),
    [] // Empty dependency array is now truly stable
  );

  // Memoize the data processing trigger to prevent unnecessary effect runs
  const triggerDataProcessing = useCallback(() => {
    setIsProcessing(true);
    debouncedProcessData(data, columns, config, forecastPeriods, seasonLength, modelType);
  }, [data, columns, config, forecastPeriods, seasonLength, modelType, debouncedProcessData]);

  // Update processed data when config or data changes
  React.useEffect(() => {
    triggerDataProcessing();
    return () => {
      debouncedProcessData.cancel();
    };
  }, [triggerDataProcessing, debouncedProcessData]);

  // Memoize chart props to prevent unnecessary re-renders
  const chartProps = useMemo(() => ({
    data: processedData,
    dateColumn: config?.dateColumn,
    valueColumn: config?.valueColumn,
    isLoading: isProcessing
  }), [processedData, config?.dateColumn, config?.valueColumn, isProcessing]);

  // Memoize config completeness check
  const isConfigComplete = useMemo(() => 
    !!dataSourceId && !!config?.dateColumn && !!config?.valueColumn,
    [dataSourceId, config?.dateColumn, config?.valueColumn]
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Sigma Forecast Plugin
        </Typography>
        
        {/* Configuration Panel */}
        <ForecastConfig />

        {/* Download Data Button */}
        {isConfigComplete && (
          <Box sx={{ mb: 2 }}>
            <button
              onClick={() => {
                const csv = exportForecastDataToCSV(processedData, 'date_index', 'actuals', 'forecast');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'forecast_data.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              style={{
                padding: '8px 16px',
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 600,
                marginBottom: 8
              }}
            >
              Download Data (CSV)
            </button>
          </Box>
        )}

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

        {/* Always render chart if config is complete, show loading state */}
        {isConfigComplete && (
          <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
            <ForecastChart {...chartProps} />
            {isProcessing && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  zIndex: 1
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default React.memo(App); 