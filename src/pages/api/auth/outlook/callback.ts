import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const clientId = process.env.MICROSOFT_CLIENT_ID;
const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/outlook/callback`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { code } = req.query;
    if (!code) {
      throw new Error('Authorization code is missing');
    }

    // Parameters for the token request
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId || '',
      client_secret: clientSecret || '',
      code: code.toString(),
      redirect_uri: redirectUri,
    });

    // Make the POST request to obtain tokens
    const tokenResponse = await axios.post(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      tokenParams.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const tokens = tokenResponse.data;

    console.log('Tokens obtained successfully');

    // Securely store tokens in cookies
    res.setHeader('Set-Cookie', [
      `outlookTokens=${encodeURIComponent(JSON.stringify(tokens))}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      `isOutlookConnected=true; Path=/; HttpOnly; Secure; SameSite=Strict`,
    ]);
    res.redirect('/settings');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error during Microsoft OAuth callback:', error.response.data);
    } else {
      const errorMessage = (error as Error).message;
      console.error('Error during Microsoft OAuth callback:', errorMessage);
    }
    res.status(400).send('Error during Microsoft OAuth callback');
  }
}