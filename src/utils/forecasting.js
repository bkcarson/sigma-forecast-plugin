import { fetchProphetForecast } from './prophetApi';

// Generate forecast using Simple Exponential Smoothing (SES)
export const generateForecast = (historicalData, periods, alpha = 0.3) => {
  if (!historicalData || historicalData.length < 2) {
    return [];
  }

  let lastForecast = historicalData[0]; // Initial forecast is the first data point

  // Calculate one-step-ahead forecasts for the historical data
  for (let i = 0; i < historicalData.length; i++) {
    const currentDataPoint = historicalData[i];
    lastForecast = alpha * currentDataPoint + (1 - alpha) * lastForecast;
  }

  // Generate future forecasts
  const futureForecasts = [];
  for (let i = 0; i < periods; i++) {
    // For future, use last forecast as the 'current' value
    lastForecast = alpha * lastForecast + (1 - alpha) * lastForecast;
    futureForecasts.push(Math.max(0, lastForecast));
  }

  return futureForecasts;
};

// Process and validate time series data
export const processTimeSeriesData = (data, dateColumn, valueColumn) => {
  if (!data || !dateColumn || !valueColumn) {
    return {
      historical: [],
      forecast: []
    };
  }

  // Extract and sort data by date
  const timeSeriesData = data[valueColumn] || [];
  
  // Basic validation
  if (timeSeriesData.length < 2) {
    console.warn('Insufficient data points for forecasting');
    return {
      historical: timeSeriesData,
      forecast: []
    };
  }

  return {
    historical: timeSeriesData,
    forecast: generateForecast(timeSeriesData, 5) // Default to 5 periods
  };
};

// Async version: Try Prophet API, fallback to SES
export const processTimeSeriesDataAsync = async (data, dateColumn, valueColumn, forecastPeriods = 5, prophetApiUrl = null) => {
  if (!data || !dateColumn || !valueColumn) {
    return {
      historical: [],
      forecast: []
    };
  }

  // Extract and sort data by date
  const timeSeriesData = data[valueColumn] || [];

  if (timeSeriesData.length < 2) {
    console.warn('Insufficient data points for forecasting');
    return {
      historical: timeSeriesData,
      forecast: []
    };
  }

  // Prepare Prophet format: [{ ds: 'YYYY-MM-DD', y: value }]
  const prophetHistory = (data[dateColumn] || []).map((ds, i) => ({
    ds: typeof ds === 'string' ? ds : String(ds),
    y: timeSeriesData[i]
  }));

  if (prophetApiUrl) {
    try {
      const forecastResult = await fetchProphetForecast(prophetHistory, forecastPeriods, prophetApiUrl);
      // Prophet returns [{ ds, yhat }...], extract yhat values
      const forecast = forecastResult.map(item => item.yhat);
      return {
        historical: timeSeriesData,
        forecast
      };
    } catch (e) {
      console.warn('Prophet API failed, falling back to SES:', e);
    }
  }

  // Fallback to SES
  return {
    historical: timeSeriesData,
    forecast: generateForecast(timeSeriesData, forecastPeriods)
  };
}; 