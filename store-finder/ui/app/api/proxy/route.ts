import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const radius_km = searchParams.get('radius_km');
  const format = searchParams.get('format');

  if (!lat || !lon || !radius_km) {
    return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 });
  }

  if (format === 'orc') {
    // Proxy to the backend's ORC endpoint and stream the file
    const flaskUrl = `http://127.0.0.1:5000/nearest-stores-orc?lat=${lat}&lon=${lon}&radius_km=${radius_km}`;
    const response = await fetch(flaskUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to download ORC file' }, { status: response.status });
    }
    // Stream the file as a download
    const blob = await response.blob();
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="stores.orc"',
      },
    });
  }

  const flaskUrl = `http://127.0.0.1:5000/nearest-stores?lat=${lat}&lon=${lon}&radius_km=${radius_km}`;

  try {
    const response = await fetch(flaskUrl);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Proxy error' }, { status: 500 });
  }
}
