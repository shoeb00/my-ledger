const API_URL = process.env.NEXT_PUBLIC_API_URL;
// eslint-disable-next-line turbo/no-undeclared-env-vars
const debugging = process.env.NODE_ENV === "development";
type Method = "GET" | "POST" | "PUT" | "DELETE";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResult = { err: string | null; data: any };
const inFlightGets = new Map<string, Promise<ApiResult>>();
let requestSequence = 0;

const parseJson = (text: string) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const safeParseResponse = async (response: Response) => {
  const text = await response.text();
  const data = parseJson(text);
  if (!response.ok || (data?.statusCode && data.statusCode > 201)) {
    const message =
      (Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message) ||
      data?.error ||
      (text && text.length < 200 ? text : null) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return data;
};

interface ClerkGlobal {
  loaded: boolean;
  openSignIn?: () => void;
  session?: {
    getToken: () => string;
  };
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
): Promise<ApiResult> => {
  try {
    await waitForClerk();
    if (!window.Clerk?.session) throw new Error("Session not initiated");

    const token = await window.Clerk.session.getToken();
    const url = new URL(API_URL + endpoint);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        url.searchParams.set(key, String(value));
      }
    }
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const options: RequestInit = {
      method,
      headers,
    };
    if (body && method !== "GET" && method !== "DELETE") {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    const getKey = `${url.toString()}:${token}`;
    if (method === "GET") {
      const existingRequest = inFlightGets.get(getKey);
      if (existingRequest) {
        if (debugging) {
          console.info(`[api] coalesced GET ${url.pathname}${url.search}`);
        }
        return existingRequest;
      }
    }

    const requestId = ++requestSequence;
    const request = (async (): Promise<ApiResult> => {
      const startedAt = Date.now();
      try {
        if (debugging) {
          console.info(
            `[api ${requestId}] ${method} ${url.pathname}${url.search}`,
          );
        }
        const response = await fetch(url.toString(), options);
        const responseData = await safeParseResponse(response);
        if (debugging) {
          console.info(
            `[api ${requestId}] ${response.status} ${method} ${url.pathname} (${Date.now() - startedAt}ms)`,
          );
        }
        return { err: null, data: responseData };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Oops, something went wrong";
        if (debugging) {
          console.error(`[api ${requestId}] ${method} ${url.pathname}`, error);
        }
        return { err: message, data: null };
      }
    })();

    if (method !== "GET") return request;

    inFlightGets.set(getKey, request);
    try {
      return await request;
    } finally {
      if (inFlightGets.get(getKey) === request) inFlightGets.delete(getKey);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Oops, something went wrong";
    if (debugging) console.error("[api] request setup failed", error);
    return { err: message, data: null };
  }
};
