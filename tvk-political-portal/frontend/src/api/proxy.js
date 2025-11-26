/* eslint-disable */

export default async function handler(req, res) {
  // 1. Get secrets from Environment Variables
  const backendUrl = process.env.AZURE_BACKEND_URL;
  const apiKey = process.env.API_SECRET_KEY;

  // 2. Safety Check
  if (!backendUrl) {
    return res.status(500).json({ error: 'Backend URL not configured' });
  }

  try {
    // 3. Call Azure
    const response = await fetch(`${backendUrl}/api/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
      },
    });

    // 4. Handle Azure Errors
    if (!response.ok) {
      return res.status(response.status).json({ error: `Azure Error: ${response.status}` });
    }

    // 5. Send Data to Frontend
    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Proxy Connection Failed' });
  }
}