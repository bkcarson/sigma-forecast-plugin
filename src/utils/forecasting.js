// Prophet API utility removed; only client-side ARIMA/Holt-Winters is used
import forecast from 'nostradamus';

// Generate forecast using auto-optimized Holt-Winters parameters
export const generateForecast = (historicalData, periods) => {
  if (!historicalData || historicalData.length < 2) {
    return [];
  }
  // Inline optimizeHoltWintersParams to avoid ESLint no-unused-vars
  function optimizeHoltWintersParams(data, forecastPeriods) {
    const alphas = [0.2, 0.4, 0.6, 0.8];
    const betas = [0.1, 0.3, 0.5];
    const gammas = [0, 0.1, 0.3];
    const seasonLengths = [0, 4, 6, 12]; // 0 disables seasonality

    let bestParams = { alpha: 0.3, beta: 0.1, gamma: 0, seasonLength: 0 };
    let bestError = Infinity;

    const N = Math.min(forecastPeriods, Math.max(3, Math.floor(data.length / 4)));
    const train = data.slice(0, data.length - N);
    const validation = data.slice(data.length - N);

    function meanSquaredError(actual, predicted) {
      if (!actual || !predicted || actual.length !== predicted.length) return Infinity;
      let sum = 0;
      for (let i = 0; i < actual.length; i++) {
        sum += Math.pow(actual[i] - predicted[i], 2);
      }
      return sum / actual.length;
    }

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
              const result = forecast(train, options);
              const forecastVals = result.forecast.slice(0, N);
              const error = meanSquaredError(validation, forecastVals);
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
  const { alpha, beta, gamma, seasonLength } = optimizeHoltWintersParams(historicalData, periods);
  const period = seasonLength > 0 ? seasonLength : 1;
  try {
    const predictions = forecast(historicalData, alpha, beta, gamma, period, periods);
    return predictions.map(v => Math.max(0, v));
  } catch (e) {
    console.warn('Nostradamus Holt-Winters failed:', e);
    return Array(periods).fill(historicalData[historicalData.length - 1]);
  }
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