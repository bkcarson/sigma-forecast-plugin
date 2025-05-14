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
  // Prepare separate data series for historical and forecast
  const historicalData = data.historical.map((value, index) => ({
    date: index,
    value,
  }));
  const forecastData = data.forecast.map((value, index) => ({
    date: data.historical.length + index,
    value,
  }));

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Typography variant="subtitle1" gutterBottom>
        Time Series Forecast
      </Typography>
      <ResponsiveContainer>
        <LineChart
          data={[...historicalData, ...forecastData]}
          margin={{
            top: 5,
            right: 30,
            left: 60,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            label={{ value: 'Date', position: 'outsideBottom', offset: 10 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            label={{ value: 'Value', angle: -90, position: 'outsideLeft', offset: 10 }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            data={historicalData}
            stroke="#1976d2" // Blue for actual
            dot={{ stroke: '#1976d2', fill: '#1976d2' }}
            name="Actual"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="value"
            data={forecastData}
            stroke="#ff9800" // Orange for forecast
            dot={{ stroke: '#ff9800', fill: '#ff9800' }}
            name="Forecast"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ForecastChart; 