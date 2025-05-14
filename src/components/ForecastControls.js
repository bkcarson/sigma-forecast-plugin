import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

const ForecastControls = ({
  forecastPeriods,
  onForecastPeriodChange,
  seasonLength,
  onSeasonLengthChange,
  modelType,
  onModelTypeChange
}) => {
  const handlePeriodChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 30) {
      onForecastPeriodChange(value);
    }
  };
  const handleSeasonLengthChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 365) {
      onSeasonLengthChange(value);
    }
  };
  const handleModelTypeChange = (event) => {
    onModelTypeChange(event.target.value);
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
      <TextField
        label="Season Length"
        type="number"
        value={seasonLength}
        onChange={handleSeasonLengthChange}
        inputProps={{ min: 1, max: 365 }}
        size="small"
        sx={{ width: 200, mb: 2, ml: 2 }}
        helperText="E.g., 7 for weekly, 12 for monthly, 1 for none."
      />
      <TextField
        select
        label="Model Type"
        value={modelType}
        onChange={handleModelTypeChange}
        size="small"
        sx={{ width: 200, mb: 2, ml: 2 }}
        helperText="Additive or Multiplicative"
      >
        <option value="additive">Additive</option>
        <option value="multiplicative">Multiplicative</option>
      </TextField>
    </Box>
  );
};

export default ForecastControls; 