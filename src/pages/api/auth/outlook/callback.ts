import { NextApiRequest, NextApiResponse } from 'next';
import { getTokenFromCode } from '@/lib/outlook-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { code } = req.query;
    if (!code) {
      throw new Error('Authorization code is missing');
    }

    const token = await getTokenFromCode(code as string);
    // Store token in session or database
    res.setHeader('Set-Cookie', 'isOutlookConnected=true; Path=/; HttpOnly');
    res.redirect('/settings');
  } catch (error) {
    console.error('Error during Microsoft OAuth callback:', error);
    res.status(400).send('Error during Microsoft OAuth callback');
  }
}