const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${import.meta.env.BASE_URL}api`;

type ApiOptions = RequestInit & {
  token?: string;
};

type ApiPayload = {
  error?: {
    message?: string;
  };
};

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, ...requestOptions } = options;
  const sessionToken =
    token === undefined ? localStorage.getItem('dims_token') || undefined : token;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
      ...headers
    }
  });

  const text = await response.text();
  let payload: ApiPayload = {};

  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`API returned a non-JSON response (${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'API request failed.');
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string, options?: ApiOptions) => apiRequest<T>(path, options),
  post: <T>(path: string, body: unknown, options?: ApiOptions) =>
    apiRequest<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    }),
  patch: <T>(path: string, body: unknown, options?: ApiOptions) =>
    apiRequest<T>(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body)
    })
};

export { API_BASE_URL };
