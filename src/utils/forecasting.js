// Prophet API utility removed; only client-side ARIMA/Holt-Winters is used

import zodiac from 'zodiac-ts';

// Generate forecast using zodiac-ts Holt-Winters Smoothing (with parameter optimization)
export const generateForecast = (historicalData, periods, seasonLength = 7, modelType = 'additive') => {
  if (!historicalData || historicalData.length < 2) {
    return [];
  }
  // Use provided season length and model type
  const multiplicative = modelType === 'multiplicative';
  // Initial parameters (can be optimized)
  let alpha = 0.4, gamma = 0.3, delta = 0.5;
  // Create model
  const hws = new zodiac.HoltWintersSmoothing(historicalData, alpha, gamma, delta, seasonLength, multiplicative);
  // Optimize parameters for best fit (increase iterations)
  const optimized = hws.optimizeParameters(100); // 100 iterations
  hws.alpha = optimized.alpha;
  hws.gamma = optimized.gamma;
  hws.delta = optimized.delta;
  // Predict future periods
  return hws.predict(periods).slice(-periods);
};

// Process and validate time series data
export const processTimeSeriesData = (data, dateColumn, valueColumn, forecastPeriods = 5, seasonLength = 7, modelType = 'additive') => {
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
    forecast: generateForecast(timeSeriesData, forecastPeriods, seasonLength, modelType)
  };
};

// Utility to convert processed data to CSV
export function exportForecastDataToCSV({ historical, forecast }, dateColumnName = 'date_index', valueColumnName = 'actuals', forecastColumnName = 'forecast', dateArray = null) {
  // Build rows: actuals first, then forecasts. Use dateArray (if provided) for date values, otherwise use index (as a string).
  const rows = [];
  const totalLength = (historical?.length || 0) + (forecast?.length || 0);
  for (let i = 0; i < totalLength; i++) {
    const date = (dateArray && i < dateArray.length) ? dateArray[i] : i.toString();
    const actual = i < (historical?.length || 0) ? historical[i] : '';
    const forecastVal = (i >= (historical?.length || 0)) ? forecast[i - (historical?.length || 0)] : '';
    rows.push({ [dateColumnName]: date, [valueColumnName]: actual, [forecastColumnName]: forecastVal });
  }
  // CSV header
  const header = [dateColumnName, valueColumnName, forecastColumnName];
  // CSV rows
  const csvRows = [header.join(','), ...rows.map(row => header.map(h => row[h]).join(','))];
  return csvRows.join('\n');
} 