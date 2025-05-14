// Prophet API utility removed; only client-side ARIMA/Holt-Winters is used
import holtWinters from 'holtwinters';

// Generate forecast using Holt-Winters Exponential Smoothing (additive, no seasonality by default)
export const generateForecast = (historicalData, periods, alpha = 0.3, beta = 0.1, gamma = 0, seasonLength = null) => {
  if (!historicalData || historicalData.length < 2) {
    return [];
  }

  // If seasonLength is provided and > 1, use seasonal Holt-Winters, else use double exponential smoothing
  const options = {
    alpha,
    beta,
    gamma,
    period: seasonLength || 0, // 0 disables seasonality in holtwinters
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