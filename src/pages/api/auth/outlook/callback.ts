import { NextApiRequest, NextApiResponse } from 'next';
import { getTokenFromCode } from '@/lib/outlook-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  const token = await getTokenFromCode(code as string);
  // Store token in session or database
  res.redirect('/settings');
}
