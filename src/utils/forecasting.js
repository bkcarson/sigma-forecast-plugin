// Prophet API utility removed; only client-side ARIMA/Holt-Winters is used

import zodiac from 'zodiac-ts';

// Generate forecast using zodiac-ts Holt-Winters Smoothing (with parameter optimization)
export const generateForecast = (historicalData, periods) => {
  if (!historicalData || historicalData.length < 2) {
    return [];
  }
  // Guess a reasonable season length (e.g., 7 for weekly, 12 for monthly, etc.)
  // For demo, use 7. In production, this could be user-configurable or auto-detected.
  const seasonLength = 7;
  const multiplicative = false; // Use additive by default for generality
  // Initial parameters (can be optimized)
  let alpha = 0.4, gamma = 0.3, delta = 0.5;
  // Create model
  const hws = new zodiac.HoltWintersSmoothing(historicalData, alpha, gamma, delta, seasonLength, multiplicative);
  // Optimize parameters for best fit
  const optimized = hws.optimizeParameters(20); // 20 iterations
  hws.alpha = optimized.alpha;
  hws.gamma = optimized.gamma;
  hws.delta = optimized.delta;
  // Predict future periods
  return hws.predict(periods).slice(-periods);
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