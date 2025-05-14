import React from 'react';
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

const ForecastChart = ({ data, dateColumn, valueColumn }) => {
  // Reverse forecast so new points are appended to the right
  const forecast = [...data.forecast].reverse();
  const totalLength = data.historical.length + forecast.length;
  const chartData = Array.from({ length: totalLength }, (_, i) => ({
    date: i,
    actual: i < data.historical.length ? data.historical[i] : null,
    forecast: i >= data.historical.length ? forecast[i - data.historical.length] : null,
  }));

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
            formatter={(value, name, props) => [value, name === 'actual' ? 'Actual' : name === 'forecast' ? 'Forecast' : name]}
            labelFormatter={label => `Date Index: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#1976d2" // Blue for actual
            dot={{ stroke: '#1976d2', fill: '#1976d2' }}
            name="Actual"
            isAnimationActive={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#ff9800" // Orange for forecast
            dot={{ stroke: '#ff9800', fill: '#ff9800' }}
            name="Forecast"
            isAnimationActive={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ForecastChart; 