// Prophet API utility removed; only client-side ARIMA/Holt-Winters is used
import holtWinters from 'holtwinters';

// Helper: Mean Squared Error
function meanSquaredError(actual, predicted) {
  if (!actual || !predicted || actual.length !== predicted.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < actual.length; i++) {
    sum += Math.pow(actual[i] - predicted[i], 2);
  }
  return sum / actual.length;
}

// Grid search for best Holt-Winters parameters
function optimizeHoltWintersParams(data, forecastPeriods) {
  // Reasonable grid for alpha, beta, gamma
  const alphas = [0.2, 0.4, 0.6, 0.8];
  const betas = [0.1, 0.3, 0.5];
  const gammas = [0, 0.1, 0.3];
  const seasonLengths = [0, 4, 6, 12]; // 0 disables seasonality

  let bestParams = { alpha: 0.3, beta: 0.1, gamma: 0, seasonLength: 0 };
  let bestError = Infinity;

  // Use last N points as validation (N = forecastPeriods, or 3 if not enough)
  const N = Math.min(forecastPeriods, Math.max(3, Math.floor(data.length / 4)));
  const train = data.slice(0, data.length - N);
  const validation = data.slice(data.length - N);

  for (const alpha of alphas) {
    for (const beta of betas) {
      for (const gamma of gammas) {
        for (const seasonLength of seasonLengths) {
          try {
            const options = {
              alpha,
              beta,
              gamma,
              period: seasonLength,
              m: N,
              pad: true
            };
            const result = holtWinters(train, options);
            const forecast = result.forecast.slice(0, N);
            const error = meanSquaredError(validation, forecast);
            if (error < bestError) {
              bestError = error;
              bestParams = { alpha, beta, gamma, seasonLength };
            }
          } catch (e) {
            // Ignore failed fits
          }
        }
      }
    }
  }
  return bestParams;
}

// Generate forecast using Holt-Winters Exponential Smoothing (additive, no seasonality by default)
export const generateForecast = (historicalData, periods, alpha = 0.3, beta = 0.1, gamma = 0, seasonLength = null, autoOptimize = true) => {
  if (!historicalData || historicalData.length < 2) {
    return [];
  }

  let params = { alpha, beta, gamma, seasonLength };
  if (autoOptimize) {
    const opt = optimizeHoltWintersParams(historicalData, periods);
    params = {
      alpha: opt.alpha,
      beta: opt.beta,
      gamma: opt.gamma,
      seasonLength: opt.seasonLength
    };
  }

  const options = {
    alpha: params.alpha,
    beta: params.beta,
    gamma: params.gamma,
    period: params.seasonLength || 0, // 0 disables seasonality in holtwinters
    m: periods,
    pad: true
  };

  try {
    const result = holtWinters(historicalData, options);
    // result.forecast is an array of forecasted values
    return result.forecast.map(v => Math.max(0, v));
  } catch (e) {
    console.warn('Holt-Winters failed:', e);
    // Fallback: repeat last value
    return Array(periods).fill(historicalData[historicalData.length - 1]);
  }
};

// Process and validate time series data
export const processTimeSeriesData = (data, dateColumn, valueColumn, forecastPeriods = 5, alpha = 0.3, beta = 0.1, gamma = 0, seasonLength = 0) => {
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
    forecast: generateForecast(timeSeriesData, forecastPeriods, alpha, beta, gamma, seasonLength, false)
  };
}; 