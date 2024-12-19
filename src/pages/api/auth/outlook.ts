import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@microsoft/microsoft-graph-client';
import { getAuthCodeUrl, getTokenFromCode } from '@/lib/outlook-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authCodeUrl = getAuthCodeUrl();
  res.redirect(await authCodeUrl);
}
