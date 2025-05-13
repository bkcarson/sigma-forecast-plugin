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
  // Combine historical and forecast data for display
  const chartData = [
    ...data.historical.map((value, index) => ({
      date: index, // This will be replaced with actual dates
      value,
      type: 'Historical'
    })),
    ...data.forecast.map((value, index) => ({
      date: data.historical.length + index,
      value,
      type: 'Forecast'
    }))
  ];

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
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            label={{ value: dateColumn || 'Date', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            label={{ value: valueColumn || 'Value', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Value"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ForecastChart; 