import { cookies } from "next/headers";
import { getCurrentUser, type StrapiUser } from "./auth";

/** Server Component / Server Action helper — reads the session cookie and resolves the user. */
export async function getSession(): Promise<{ user: StrapiUser; jwt: string } | null> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("vairutya_jwt")?.value;
  if (!jwt) return null;

  const user = await getCurrentUser(jwt);
  if (!user) return null;

  return { user, jwt };
}