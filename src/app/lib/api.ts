const API_BASE_URL = '/api/v1';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiOptions extends Omit<RequestInit, 'body'> {
  method?: ApiMethod;
  body?: unknown;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

async function request<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  try {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: HeadersInit = {
      ...(options.body
        ? {
            'Content-Type': 'application/json',
          }
        : {}),

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      body:
        typeof options.body === 'string'
          ? options.body
          : options.body
            ? JSON.stringify(options.body)
            : undefined,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const responseData = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorData = responseData as ApiErrorResponse;
      throw new Error(
        errorData?.message ||
          errorData?.error ||
          `HTTP Error ${response.status}`,
      );
    }

    return responseData as T;
  } catch (error) {
    console.error('API REQUEST ERROR:', error);
    throw error;
  }
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'GET' });
}

export async function apiPost<T>(endpoint: string, body?: unknown): Promise<T> {
  return request<T>(endpoint, { method: 'POST', body });
}

export async function apiPut<T>(endpoint: string, body?: unknown): Promise<T> {
  return request<T>(endpoint, { method: 'PUT', body });
}

export async function apiPatch<T>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  return request<T>(endpoint, { method: 'PATCH', body });
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE' });
}

export async function apiFetch<T>(
  endpoint: string,
  options?: ApiOptions,
): Promise<T> {
  return request<T>(endpoint, options);
}

export { API_BASE_URL };
