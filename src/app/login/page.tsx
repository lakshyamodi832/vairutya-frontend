import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LoginForm from "@/components/auth/login-form";

export const metadata = {
  title: "Log in — Vairutya",
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-24">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-neutral-900">
        Welcome back
      </h1>
      <p className="mb-8 text-sm text-neutral-600">
        Log in to see your personalized recommendations.
      </p>
      <LoginForm />
    </main>
  );
}
