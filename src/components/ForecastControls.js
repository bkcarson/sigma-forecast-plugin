import React from 'react';
import { Box, TextField, Typography, Slider, Grid, Tooltip } from '@mui/material';

const ForecastControls = ({
  forecastPeriods,
  alpha,
  beta,
  gamma,
  seasonLength,
  onForecastPeriodChange,
  onAlphaChange,
  onBetaChange,
  onGammaChange,
  onSeasonLengthChange
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
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <Tooltip title="Level smoothing (alpha). Controls how much weight is given to recent values. 0 = slow, 1 = fast.">
            <Typography>Alpha</Typography>
          </Tooltip>
        </Grid>
        <Grid item xs={7}>
          <Slider
            value={alpha}
            min={0}
            max={1}
            step={0.01}
            onChange={(_, v) => onAlphaChange(Number(v))}
            aria-labelledby="alpha-slider"
          />
        </Grid>
        <Grid item xs={2}>
          <TextField value={alpha} size="small" inputProps={{ readOnly: true }} sx={{ width: 60 }} />
        </Grid>
        <Grid item xs={3}>
          <Tooltip title="Trend smoothing (beta). Controls how much weight is given to trend changes. 0 = no trend, 1 = fast.">
            <Typography>Beta</Typography>
          </Tooltip>
        </Grid>
        <Grid item xs={7}>
          <Slider
            value={beta}
            min={0}
            max={1}
            step={0.01}
            onChange={(_, v) => onBetaChange(Number(v))}
            aria-labelledby="beta-slider"
          />
        </Grid>
        <Grid item xs={2}>
          <TextField value={beta} size="small" inputProps={{ readOnly: true }} sx={{ width: 60 }} />
        </Grid>
        <Grid item xs={3}>
          <Tooltip title="Seasonality smoothing (gamma). 0 = no seasonality, 1 = fast.">
            <Typography>Gamma</Typography>
          </Tooltip>
        </Grid>
        <Grid item xs={7}>
          <Slider
            value={gamma}
            min={0}
            max={1}
            step={0.01}
            onChange={(_, v) => onGammaChange(Number(v))}
            aria-labelledby="gamma-slider"
          />
        </Grid>
        <Grid item xs={2}>
          <TextField value={gamma} size="small" inputProps={{ readOnly: true }} sx={{ width: 60 }} />
        </Grid>
        <Grid item xs={3}>
          <Tooltip title="Season length (periodicity). 0 disables seasonality. E.g., 12 for monthly, 4 for quarterly.">
            <Typography>Season Length</Typography>
          </Tooltip>
        </Grid>
        <Grid item xs={7}>
          <Slider
            value={seasonLength}
            min={0}
            max={24}
            step={1}
            onChange={(_, v) => onSeasonLengthChange(Number(v))}
            aria-labelledby="season-length-slider"
          />
        </Grid>
        <Grid item xs={2}>
          <TextField value={seasonLength} size="small" inputProps={{ readOnly: true }} sx={{ width: 60 }} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForecastControls; 