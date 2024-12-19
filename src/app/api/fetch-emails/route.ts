// import { google } from 'googleapis';
// import { NextApiRequest, NextApiResponse } from 'next';

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
// );

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
//     if (req.method !== 'GET') {
//       return res.status(405).json({ error: 'Method Not Allowed' });
//     }
//   try {
// console.log("fetching emails");
//     const { tokens } = req.cookies;
//     if (!tokens) {
//       return res.status(401).json({ error: 'Not authenticated' });
//     }

//     oauth2Client.setCredentials(JSON.parse(tokens));

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
//     const response = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });

//     const messages = response.data.messages
//       ? await Promise.all(
//           response.data.messages.map(async (message) => {
//         const msg = await gmail.users.messages.get({ userId: 'me', id: message.id as string });
//         })
//       )
//     : [];
//     console.log("messages", messages);
//     res.status(200).json(messages);
//   } catch (error) {
//     console.error('Error fetching emails:', error);
//     res.status(500).json({ error: 'Failed to fetch emails' });
//   }
// }

import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
);

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching emails...");

    const cookieStore = await cookies();
    const tokensCookie = cookieStore.get('tokens');

    if (!tokensCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const tokens = JSON.parse(tokensCookie.value);
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const response = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });

    const messages = response.data.messages
      ? await Promise.all(
          response.data.messages.map(async (message) => {
            const msg = await gmail.users.messages.get({ userId: 'me', id: message.id as string });
            return msg.data; // Include detailed email data
          })
        )
      : [];

    console.log("Messages fetched:", messages);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}
