import { google } from 'googleapis';
import { Client } from '@microsoft/microsoft-graph-client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
);

export async function POST(req: NextRequest) {
  try {
    console.log("Fetching emails...");

    const cookieStore = await cookies();
    const tokensCookie = cookieStore.get('tokens');
    const outlookTokensCookie = cookieStore.get('outlookTokens');
    console.log('Tokens cookie:', tokensCookie);
    console.log('Outlook tokens cookie:', outlookTokensCookie);

    const { provider } = await req.json();

    if (!tokensCookie && !outlookTokensCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (provider === 'gmail' && tokensCookie) {
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

      console.log("Messages fetched from Gmail:", messages);
      return NextResponse.json(messages);
    } else if (provider === 'outlook' && outlookTokensCookie) {
      const tokens = JSON.parse(outlookTokensCookie.value);
      console.log('access token: ', tokens.access_token);
      const client = Client.init({
        authProvider: (done) => {
          done(null, tokens.access_token);
        },
      });

      const response = await client.api('/me/messages').get();
      const messages = response.value;
      console.log("Messages fetched from Outlook:", messages);
      return NextResponse.json(messages);
    } else {
      return NextResponse.json({ error: 'Invalid provider or missing tokens' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}