const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

type ApiOptions = RequestInit & {
  token?: string;
};

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'API request failed.');
  }

  return payload;
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
