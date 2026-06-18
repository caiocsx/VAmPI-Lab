const API_BASE = import.meta.env.VITE_API_URL;

export const API_ROUTES = {
  auth: {
    login: `${API_BASE}/users/v1/login`,
    signup: `${API_BASE}/users/v1/register`,
    me: `${API_BASE}/me`,
  },
  users: {
    list: `${API_BASE}/users/v1`,
  },
  books: {
    list: `${API_BASE}/books/v1`,
  },
} as const;
