export const API_BASE = 'http://localhost:3000/api/v1';

export function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

