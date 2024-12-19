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
    if (!code) {
      throw new Error('Authorization code is missing');
    }

    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // Store tokens in session or database
    res.setHeader('Set-Cookie', 'isGmailConnected=true; Path=/; HttpOnly');
    res.redirect('/settings');
  } catch (error) {
    console.error('Error during Google OAuth callback:', error);
    res.status(400).send('Error during Google OAuth callback');
  }
}

// import { google } from 'googleapis';
// import { NextApiRequest, NextApiResponse } from 'next';

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
// );

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const { code } = req.query;

//     if (!code) {
//       throw new Error('Authorization code is missing');
//     }

//     // Exchange the authorization code for tokens
//     const { tokens } = await oauth2Client.getToken(code as string);
//     oauth2Client.setCredentials(tokens);
//     console.log("tokens", tokens);
//     // Securely store tokens in cookies
//     res.setHeader('Set-Cookie', [
//       `tokens=${encodeURIComponent(JSON.stringify(tokens))}; Path=/; HttpOnly; Secure; SameSite=Strict`,
//       `isGmailConnected=true; Path=/; HttpOnly; Secure; SameSite=Strict`,
//     ]);

//     // Redirect the user to settings or another page
//     res.redirect('/settings');
//   } catch (error) {
//     console.error('Error during Google OAuth callback:', error);
//     res.status(400).send('Error during Google OAuth callback');
//   }
// }



