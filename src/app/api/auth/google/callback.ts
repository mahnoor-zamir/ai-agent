import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      console.error('Authorization code is missing or invalid');
      return res.status(400).send('Invalid request: Authorization code is required');
    }

    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log('Tokens obtained successfully');

    // Securely store tokens in cookies
    // res.setHeader('Set-Cookie', [
    //   `tokens=${encodeURIComponent(JSON.stringify(tokens))}; Path=/;Secure; SameSite=Strict`,
    //   `isGmailConnected=true; Path=/;  Secure; SameSite=Strict`,
    // ]);
    res.setHeader('Set-Cookie', [
      `tokens=${encodeURIComponent(JSON.stringify(tokens))}; Path=/; Secure; SameSite=Strict`,
      `isGmailConnected=true; Path=/; Secure; SameSite=Strict`,
    ]);

    // Redirect to settings or another page
    res.redirect('/settings');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error during Google OAuth callback:', error.message);
    } else {
      console.error('Error during Google OAuth callback:', error);
    }
    res.status(500).send('An error occurred during the Google OAuth callback process');
  }
}
