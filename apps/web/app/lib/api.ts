const API_URL = process.env.NEXT_PUBLIC_API_URL;
// eslint-disable-next-line turbo/no-undeclared-env-vars
const debugging = process.env.NODE_ENV === 'development';
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const safeParseResponse = async (response: Response) => {
  try {
    const data = await response.json();
    if (data.statusCode > 201) throw new Error(data.message);
    return data;
  } catch (error) {
    if (debugging) console.error('Error parsing response', error);
    if (response.status > 201) throw error;
    return null;
  }
};

interface ClerkGlobal {
  loaded: boolean;
  openSignIn?: () => void;
  session?: {
    getToken: () => string;
  }
}

declare global {
  interface Window {
    Clerk?: ClerkGlobal;
  }
}

async function waitForClerk(): Promise<void> {
  if (window.Clerk?.loaded) return;

  await new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (window.Clerk?.loaded) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

export const callApi = async (
  endpoint: string,
  method: Method,
  query?: object,
  body?: object,
  // TODO: add types for the data response
): Promise<{ err: string | null; data: any }> => {
  let err = null;
  let data = null;
  try {
    await waitForClerk();
    if (!window.Clerk?.session) throw new Error('Session not initiated')
    const token = await window.Clerk?.session?.getToken();
    const url = new URL(API_URL + endpoint);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        url.searchParams.set(key, value as string);
      }
    }
    if (debugging) {
      console.log('url:', url);
      console.log('method:', method);
      console.log('body:', body);
      console.log('token:', token);
    }
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: body && JSON.stringify(body),
      credentials: 'include',
    });
    data = await safeParseResponse(response);
    if (debugging) console.log('data:', data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Oops, something went wrong';
    err = message;
    if (debugging) console.error('error', error);
  }
  return { err, data };
};
