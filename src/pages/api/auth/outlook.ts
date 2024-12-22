import { NextApiRequest, NextApiResponse } from 'next';
import { getAuthCodeUrl } from '@/lib/outlook-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authCodeUrl = await getAuthCodeUrl();
  res.redirect(authCodeUrl);
}