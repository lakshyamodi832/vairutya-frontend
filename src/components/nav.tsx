import Link from "next/link";
import { getSession } from "@/lib/session";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/knowledge", label: "Knowledge Space" },
  { href: "/experiences", label: "Experiences" },
  { href: "/quiz", label: "Quiz" },
  { href: "/about", label: "About" },
];

export default async function Nav() {
  const session = await getSession();

  return (
    <header className="border-b border-neutral-200">
      <nav className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-medium tracking-tight">
          Vairutya
        </Link>
        <ul className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/cart" className="hover:underline">
              Cart
            </Link>
          </li>
          <li>
            {session ? (
              <Link href="/dashboard" className="hover:underline">
                {session.user.username}
              </Link>
            ) : (
              <Link href="/login" className="hover:underline">
                Log in
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}