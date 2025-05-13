# Sigma Forecast Plugin

A custom Sigma plugin that enables time series forecasting directly within your Sigma workbooks. This plugin allows users to visualize historical data and generate statistical forecasts for future time periods.

## Features

- Visualize time series data with date-based x-axis and numeric y-axis values
- Interactive interface for specifying forecast periods
- Statistical forecasting using time series analysis
- Seamless integration with Sigma workbooks
- Real-time updates as data changes

## Prerequisites

- Access to a Sigma Plugin Dev Playground (created by your organization Admin)
- Account with "Manage plugins" permission enabled
- Node.js and yarn package manager installed
- Basic understanding of Sigma workbook elements

## Installation

1. Clone this repository:
```bash
git clone https://github.com/your-org/sigma-forecast-plugin.git
cd sigma-forecast-plugin
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn start
```

## Development Setup

1. Register the plugin in your Sigma organization:
   - Navigate to your Sigma Plugin Dev Playground
   - Set the development URL to `http://localhost:3000`
   - Follow your organization's plugin registration process

2. Configure the plugin in a Sigma workbook:
   - Create or open a workbook
   - Click Edit in the workbook header
   - Click the + button in the sidebar
   - Select PLUGINS under UI ELEMENTS
   - Choose Sigma Plugin Dev Playground

## Usage

1. In your Sigma workbook, configure the plugin with:
   - A data source containing your time series data
   - A date column for the x-axis
   - A numeric column for the y-axis values

2. Use the plugin interface to:
   - Enter the number of periods to forecast
   - View the historical data visualization
   - See the forecasted values and confidence intervals

## Plugin Configuration

The plugin accepts the following configuration options:

- `data source`: Select the data element containing your time series data
- `date column`: Choose the column containing date values
- `value column`: Select the column containing numeric values to forecast
- `forecast periods`: Enter the number of future periods to forecast

## Development

This plugin is built using:
- React
- @sigmacomputing/plugin library
- Statistical forecasting libraries

To modify or extend the plugin:

1. Make your changes in the source code
2. The development server will automatically reload
3. Refresh the plugin in your Sigma workbook to see changes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Your chosen license]

## Support

For support, please contact [your organization's support contact]

## Acknowledgments

- Sigma Computing for the plugin development framework
- [Any other acknowledgments] 