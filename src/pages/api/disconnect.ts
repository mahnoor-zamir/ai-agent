import { NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { provider } = req.body;

    if (!provider || (provider !== 'gmail' && provider !== 'outlook')) {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    const cookieStore = await cookies();

    if (provider === 'gmail') {
      cookieStore.delete('tokens');
      cookieStore.delete('isGmailConnected');
    } else if (provider === 'outlook') {
      cookieStore.delete('outlookTokens');
      cookieStore.delete('isOutlookConnected');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error during disconnection:', error);
    return res.status(500).json({ error: 'An error occurred during disconnection' });
  }
}