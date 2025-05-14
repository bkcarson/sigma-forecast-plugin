// Simple linear regression for forecasting
const linearRegression = (x, y) => {
  const n = x.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

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