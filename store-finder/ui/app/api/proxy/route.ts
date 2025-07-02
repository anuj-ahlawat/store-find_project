import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const radius_km = searchParams.get('radius_km');

  if (!lat || !lon || !radius_km) {
    return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 });
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
