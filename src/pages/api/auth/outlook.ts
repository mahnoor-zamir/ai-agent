import { NextApiRequest, NextApiResponse } from 'next';

const clientId = process.env.MICROSOFT_CLIENT_ID;
const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/outlook/callback`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=openid%20profile%20offline_access%20https://graph.microsoft.com/Mail.ReadWrite%20https://graph.microsoft.com/Mail.Send`;
  res.redirect(url);
}