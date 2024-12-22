// src/app/api/send-emails/route.ts
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
    const cookieStore = cookies();
    const tokensCookie = cookieStore.get('tokens');

    if (!tokensCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const tokens = JSON.parse(tokensCookie.value);
    if (!tokens.access_token) {
      return NextResponse.json({ error: 'Invalid authentication tokens' }, { status: 401 });
    }

    oauth2Client.setCredentials(tokens);

    const body = await req.json();
    const { to, cc, bcc, subject, content } = body;

    if (!to || !subject || !content) {
      return NextResponse.json({ error: 'Missing required fields: to, subject, or content' }, { status: 400 });
    }

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

    console.log('Email sent successfully:', response.data);
    return NextResponse.json({ success: true, messageId: response.data.id });
  } catch (error) {
    console.error('Error sending email:', error);

    let errorMessage = 'Failed to send email';
    let statusCode = 500;

    if (error.response && error.response.data) {
      errorMessage = error.response.data.error.message || errorMessage;
      statusCode = error.response.status || statusCode;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
