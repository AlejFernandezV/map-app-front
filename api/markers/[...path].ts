export default async function handler(req: any, res: any) {
  const { path = [] } = req.query;

  const backendUrl = `https://46.250.169.37:8443/api/markers/${path.join('/')}`;

  try {
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body:
        req.method !== 'GET' && req.method !== 'HEAD'
          ? JSON.stringify(req.body)
          : undefined,
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (error) {
    res.status(500).json({ error: 'Backend not reachable' });
  }
}
