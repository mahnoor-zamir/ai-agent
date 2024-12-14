export async function fetchMakeData(startDate: string, endDate: string) {
  const apiUrl = process.env.MAKE_API_URL;
  const apiKey = process.env.MAKE_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error("Make.com API configuration is missing");
  }

  const response = await fetch(`${apiUrl}?startDate=${startDate}&endDate=${endDate}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data from Make.com: ${response.statusText}`);
  }

  return response.json();
}

