// Prophet API utility removed; only client-side ARIMA/Holt-Winters is used

// Holt's Linear Trend (Double Exponential Smoothing) implementation
function holtLinearForecast(series, forecastPeriods, alpha = 0.8, beta = 0.2) {
  if (!series || series.length < 2) return [];
  // Initialization
  let level = series[0];
  let trend = series[1] - series[0];
  let lastLevel, lastTrend;

  // Fit model to data
  for (let i = 1; i < series.length; i++) {
    lastLevel = level;
    lastTrend = trend;
    level = alpha * series[i] + (1 - alpha) * (lastLevel + lastTrend);
    trend = beta * (level - lastLevel) + (1 - beta) * lastTrend;
  }

  // Forecast future periods
  const forecasts = [];
  for (let m = 1; m <= forecastPeriods; m++) {
    forecasts.push(level + m * trend);
  }
  return forecasts;
}

// Generate forecast using Holt's Linear Trend
export const generateForecast = (historicalData, periods) => {
  if (!historicalData || historicalData.length < 2) {
    return [];
  }
  return holtLinearForecast(historicalData, periods);
};

// Process and validate time series data
export const processTimeSeriesData = (data, dateColumn, valueColumn, forecastPeriods = 5) => {
  if (!data || !dateColumn || !valueColumn) {
    return {
      historical: [],
      forecast: []
    };
  }

  const timeSeriesData = data[valueColumn] || [];
  if (timeSeriesData.length < 2) {
    console.warn('Insufficient data points for forecasting');
    return {
      historical: timeSeriesData,
      forecast: []
    };
  }

  return {
    historical: timeSeriesData,
    forecast: generateForecast(timeSeriesData, forecastPeriods)
  };
}; 