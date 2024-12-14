import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profileName = searchParams.get('profileName');
  const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '')

  if (!profileName || !apiKey) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    // Simulate fetching Google Business Profile and reviews
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Replace with actual API call to Google Business Profile API
    const profile = {
      name: profileName,
      rating: 4.5,
      reviewsCount: 150
    }
    const reviews = [
      { id: '1', author: 'John Doe', rating: 5, text: 'Great service!', time: '1 hour ago' },
      { id: '2', author: 'Jane Smith', rating: 4, text: 'Good experience overall.', time: '1 day ago' },
      { id: '3', author: 'Alice Johnson', rating: 3, text: 'Could be better.', time: '3 days ago' },
    ]

    return NextResponse.json({ profile, reviews });
  } catch (error) {
    console.error('Error fetching Google Business Profile:', error);
    return NextResponse.json({ error: 'Failed to fetch Google Business Profile' }, { status: 500 });
  }
}

