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

    const tokenResponse = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
    });

    const tokens = tokenResponse.data;

    console.log('Tokens obtained successfully');

    // Securely store tokens in cookies
    res.setHeader('Set-Cookie', [
      `outlookTokens=${encodeURIComponent(JSON.stringify(tokens))}; Path=/; Secure; SameSite=Strict`,
      `isOutlookConnected=true; Path=/; Secure; SameSite=Strict`,
    ]);
    res.redirect('/settings');
  } catch (error) {
    console.error('Error during Microsoft OAuth callback:', error);
    res.status(400).send('Error during Microsoft OAuth callback');
  }
}