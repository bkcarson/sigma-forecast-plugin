import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

const ForecastControls = ({
  forecastPeriods,
  onForecastPeriodChange
}) => {
  const handlePeriodChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 30) {
      onForecastPeriodChange(value);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Forecast Settings
      </Typography>
      <TextField
        label="Number of Periods to Forecast (1-30)"
        type="number"
        value={forecastPeriods}
        onChange={handlePeriodChange}
        inputProps={{ min: 1, max: 30 }}
        size="small"
        sx={{ width: 200, mb: 2 }}
        helperText="Enter a value from 1 to 30."
      />
    </Box>
  );
};

export default ForecastControls; 