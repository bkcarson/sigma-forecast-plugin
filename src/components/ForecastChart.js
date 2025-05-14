import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Typography } from '@mui/material';

const ForecastChart = React.memo(({ data, dateColumn, valueColumn, isLoading }) => {
  // Memoize chart data transformation
  const chartData = useMemo(() => {
    if (!data?.historical?.length && !data?.forecast?.length) {
      return [];
    }
    const forecast = [...(data.forecast || [])].reverse();
    const totalLength = (data.historical?.length || 0) + (forecast?.length || 0);
    return Array.from({ length: totalLength }, (_, i) => ({
      date: i,
      actual: i < (data.historical?.length || 0) ? data.historical[i] : null,
      forecast: i >= (data.historical?.length || 0) ? forecast[i - (data.historical?.length || 0)] : null,
    }));
  }, [data?.historical, data?.forecast]);

  // Memoize tooltip formatter
  const tooltipFormatter = useMemo(() => 
    (value, name, props) => [value, name === 'actual' ? 'Actual' : name === 'forecast' ? 'Forecast' : name],
    []
  );

  const labelFormatter = useMemo(() => 
    label => `Date Index: ${label}`,
    []
  );

  // Early return if no data
  if (!chartData.length) {
    return (
      <Box sx={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Typography variant="subtitle1" gutterBottom>
        Time Series Forecast
      </Typography>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 80,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            width={80}
          />
          <Tooltip 
            formatter={tooltipFormatter}
            labelFormatter={labelFormatter}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#1976d2"
            dot={{ stroke: '#1976d2', fill: '#1976d2' }}
            name="Actual"
            isAnimationActive={false}
            connectNulls={false}
            opacity={isLoading ? 0.5 : 1}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#ff9800"
            dot={{ stroke: '#ff9800', fill: '#ff9800' }}
            name="Forecast"
            isAnimationActive={false}
            connectNulls={false}
            opacity={isLoading ? 0.5 : 1}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
});

ForecastChart.displayName = 'ForecastChart';

export default ForecastChart; 