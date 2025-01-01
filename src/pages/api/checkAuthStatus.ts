// pages/api/checkAuthStatus.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const tokens = req.cookies.tokens;
  const outlookTokens = !tokens ? req.cookies.outlookTokens: false;
  
  
  res.status(200).json({
    gmail: !!tokens,
    outlook: !!outlookTokens
  });
}