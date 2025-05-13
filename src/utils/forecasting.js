// Simple moving average calculation
const calculateMovingAverage = (data, windowSize) => {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = data.slice(start, i + 1);
    const average = window.reduce((sum, val) => sum + val, 0) / window.length;
    result.push(average);
  }
  return result;
};

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

// Generate forecast using simple linear regression
export const generateForecast = (historicalData, periods) => {
  if (!historicalData || historicalData.length < 2) {
    return [];
  }

  // Create x values (0 to n-1)
  const x = Array.from({ length: historicalData.length }, (_, i) => i);
  
  // Calculate moving average to smooth the data
  const smoothedData = calculateMovingAverage(historicalData, 3);
  
  // Perform linear regression
  const { slope, intercept } = linearRegression(x, smoothedData);
  
  // Generate forecast
  const forecast = [];
  const lastX = x[x.length - 1];
  
  for (let i = 1; i <= periods; i++) {
    const forecastX = lastX + i;
    const forecastY = slope * forecastX + intercept;
    forecast.push(Math.max(0, forecastY)); // Ensure non-negative values
  }

  return forecast;
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