// Prophet API integration utility for Sigma plugin
export async function fetchProphetForecast(historicalData, numDays, apiUrl) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: historicalData, future_days: numDays }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Prophet forecast:', error);
    throw error;
  }
} 