// app/api/calendar/add-events/route.ts
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
    const tokensCookie = await cookieStore.get('tokens');

    if (!tokensCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const tokens = JSON.parse(tokensCookie.value);
    oauth2Client.setCredentials(tokens);

    const appointmentDetails = await req.json();
    const { title, date, startTime, endTime, location, email, notes } = appointmentDetails;

    if (!title || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Convert date and time strings to ISO format
    const startDateTime = new Date(date);
    const endDateTime = new Date(date);
    
    // Parse time strings (HH:mm) and set hours/minutes
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    startDateTime.setHours(startHours, startMinutes, 0);
    endDateTime.setHours(endHours, endMinutes, 0);

    const event = {
      summary: title,
      location: location || '',
      description: notes || '',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Asia/Karachi', // Adjust based on your needs
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Asia/Karachi', // Adjust based on your needs
      },
      attendees: email ? [{ email }] : [],
    };

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendUpdates: 'all', // Sends email notifications to attendees
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error adding event:', error);
    return NextResponse.json(
      { 
        error: 'Failed to add event', 
        details: error.response?.data || error.message 
      }, 
      { status: 500 }
    );
  }
}