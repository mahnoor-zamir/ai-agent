//src\app\api\fetch-emails\route.ts
import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
);

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching emails...");

    const cookieStore = await cookies();
    const tokensCookie = cookieStore.get('tokens');
    console.log('Tokens cookie:', tokensCookie);

    if (!tokensCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const tokens = JSON.parse(tokensCookie.value);
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const response = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });

    const messages = response.data.messages
      ? await Promise.all(
          response.data.messages.map(async (message) => {
            const msg = await gmail.users.messages.get({ userId: 'me', id: message.id as string });
            return msg.data; // Include detailed email data
          })
        )
      : [];

    console.log("Messages fetched:", messages);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}
