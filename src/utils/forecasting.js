import { fetchProphetForecast } from './prophetApi';

// Generate forecast using Holt-Winters Double Exponential Smoothing (no seasonality)
export const generateForecast = (historicalData, periods, alpha = 0.3, beta = 0.1) => {
  if (!historicalData || historicalData.length < 2) {
    return [];
  }

  // Initialize level and trend
  let level = historicalData[0];
  let trend = historicalData[1] - historicalData[0];

  // Apply double exponential smoothing to historical data
  for (let i = 1; i < historicalData.length; i++) {
    const value = historicalData[i];
    const prevLevel = level;
    level = alpha * value + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
  }

  // Forecast future periods
  const futureForecasts = [];
  for (let i = 1; i <= periods; i++) {
    const forecast = level + i * trend;
    futureForecasts.push(Math.max(0, forecast));
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