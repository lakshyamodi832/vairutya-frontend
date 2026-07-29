const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  jwt: string;
  user: StrapiUser;
}

export async function login(identifier: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Login failed");
  }
  return data;
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Registration failed");
  }
  return data;
}

export async function getCurrentUser(jwt: string): Promise<StrapiUser | null> {
  const res = await fetch(`${STRAPI_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}