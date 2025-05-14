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

// Generate forecast using a more robust method
export const generateForecast = (historicalData, periods) => {
  if (!historicalData || historicalData.length < 2) {
    return [];
  }

  const n = historicalData.length;
  const x = Array.from({ length: n }, (_, i) => i);

  let forecast = [];

  if (n >= 7) {
    // Use linear regression on all data
    const { slope, intercept } = linearRegression(x, historicalData);
    const lastX = x[x.length - 1];
    for (let i = 1; i <= periods; i++) {
      const forecastX = lastX + i;
      const forecastY = slope * forecastX + intercept;
      forecast.push(Math.max(0, forecastY));
    }
  } else {
    // For short series, use mean of last 3 values
    const window = historicalData.slice(-3);
    const mean = window.reduce((sum, val) => sum + val, 0) / window.length;
    for (let i = 0; i < periods; i++) {
      forecast.push(Math.max(0, mean));
    }
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