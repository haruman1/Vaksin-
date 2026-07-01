'use client';

export interface DecodedToken {
  id: string;
  name: string;
  email: string;
  role: string;
  wilayah: string;
  exp: number;
}

export function parseJwt(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function getUserFromToken(): DecodedToken | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  if (!token) return null;

  const decoded = parseJwt(token);
  if (!decoded) return null;

  // Check if token is expired
  if (decoded.exp && Date.now() >= decoded.exp * 1000) {
    localStorage.removeItem('token');
    return null;
  }

  return decoded;
}
