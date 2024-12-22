import { ConfidentialClientApplication } from '@azure/msal-node';

if (!process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_TENANT_ID || !process.env.MICROSOFT_CLIENT_SECRET) {
  throw new Error('Missing required environment variables for Outlook authentication');
}

const msalConfig = {
  auth: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}`,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  },
};

const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/outlook/callback`;

const clientApp = new ConfidentialClientApplication(msalConfig);

export function getAuthCodeUrl() {
  const authCodeUrlParameters = {
    scopes: ['https://graph.microsoft.com/.default'],
    redirectUri: REDIRECT_URI,
  };

  return clientApp.getAuthCodeUrl(authCodeUrlParameters);
}

export async function getTokenFromCode(authCode: string) {
  const tokenRequest = {
    code: authCode,
    scopes: ['https://graph.microsoft.com/.default'],
    redirectUri: REDIRECT_URI,
  };

  const response = await clientApp.acquireTokenByCode(tokenRequest);
  return response.accessToken;
}