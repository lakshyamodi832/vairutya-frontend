import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import RegisterForm from "@/components/auth/register-form";

export const metadata = {
  title: "Sign up — Vairutya",
};

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-24">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-neutral-900">
        Create your account
      </h1>
      <p className="mb-8 text-sm text-neutral-600">
        Take the quiz and get recommendations tailored to you.
      </p>
      <RegisterForm />
    </main>
  );
}
