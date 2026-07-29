import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LogoutButton from "@/components/auth/logout-button";

export const metadata = {
  title: "Dashboard — Vairutya",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Welcome back, {session.user.username}
          </h1>
          <p className="mt-1 text-sm text-neutral-600">{session.user.email}</p>
        </div>
        <LogoutButton />
      </div>

      {/* TODO: once the quiz + HealthProfile flow is built, replace this
          with personalized product/blog recommendations based on the
          user's latest HealthProfile dominant category. */}
      <div className="mt-10 rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
        You haven&apos;t taken the quiz yet. Personalized recommendations will
        show up here once the quiz is built.
      </div>
    </main>
  );
}
