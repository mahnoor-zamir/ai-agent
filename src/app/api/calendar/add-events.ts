import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
);

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const tokensCookie = cookieStore.get('tokens');

    if (!tokensCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const tokens = JSON.parse(tokensCookie.value);
    oauth2Client.setCredentials(tokens);

    const body = await req.json();
    const { title, date, startTime, endTime, location, email, notes } = body;

    const event = {
      summary: title,
      location: location,
      description: notes,
      start: {
        dateTime: `${date}T${startTime}:00`,
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: `${date}T${endTime}:00`,
        timeZone: 'America/Los_Angeles',
      },
      attendees: [{ email: email }],
    };

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error adding event:', error);
    return NextResponse.json({ error: 'Failed to add event' }, { status: 500 });
  }
}