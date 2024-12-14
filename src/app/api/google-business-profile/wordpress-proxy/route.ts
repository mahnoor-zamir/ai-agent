import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const wpUrl = process.env.WORDPRESS_URL;
  const wpUsername = process.env.WORDPRESS_USERNAME;
  const wpPassword = process.env.WORDPRESS_PASSWORD;

  if (!endpoint || !wpUrl || !wpUsername || !wpPassword) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${wpUrl}/wp-json/wp/v2/${endpoint}`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')
      }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('WordPress API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data from WordPress' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const wpUrl = process.env.WORDPRESS_URL;
  const wpUsername = process.env.WORDPRESS_USERNAME;
  const wpPassword = process.env.WORDPRESS_PASSWORD;

  if (!endpoint || !wpUrl || !wpUsername || !wpPassword) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const response = await axios.post(`${wpUrl}/wp-json/wp/v2/${endpoint}`, body, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64'),
        'Content-Type': 'application/json'
      }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('WordPress API Error:', error);
    return NextResponse.json({ error: 'Failed to update data in WordPress' }, { status: 500 });
  }
}

