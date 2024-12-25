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
    const cookieStore = await cookies();
    const tokensCookie = cookieStore.get('tokens');
    const outlookTokensCookie = cookieStore.get('outlookTokens');

    if (!tokensCookie && !outlookTokensCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { to, cc, bcc, subject, content } = body;
    const provider = 'gmail'
    console.log({ to, cc, bcc, subject, content, provider })
    // if (!to || !subject || !content || !provider) {
    //   return NextResponse.json({ error: 'Missing required fields: to, subject, content, or provider' }, { status: 400 });
    // }

    if (provider === 'gmail' && tokensCookie) {
      const tokens = JSON.parse(tokensCookie.value);
      if (!tokens.access_token) {
        return NextResponse.json({ error: 'Invalid authentication tokens' }, { status: 401 });
      }

      oauth2Client.setCredentials(tokens);

      // Create email in RFC 2822 format
      const email = [
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `To: ${to}`,
        cc ? `Cc: ${cc}` : '',
        bcc ? `Bcc: ${bcc}` : '',
        `Subject: ${subject}`,
        '',
        content,
      ].filter(Boolean).join('\r\n');

      // Encode the email in Base64Url format
      const encodedEmail = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedEmail,
        },
      });

      console.log('Email sent successfully via Gmail:', response.data);
      return NextResponse.json({ success: true, messageId: response.data.id });
    }  else {
      return NextResponse.json({ error: 'Invalid provider or missing tokens' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error sending email:', error);

    let errorMessage = 'Failed to send email';
    let statusCode = 500;

    if (error instanceof Error && (error as any).response && (error as any).response.data) {
      errorMessage = (error as any).response.data.error.message || errorMessage;
      statusCode = (error as any).response.status || statusCode;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}