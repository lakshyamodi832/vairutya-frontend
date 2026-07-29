import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Nav from "@/components/nav";

// NOTE: using system fonts as a placeholder. Swap in the final typeface
// (via next/font/google or next/font/local) once designs are finalized.

export const metadata: Metadata = {
  title: "Vairutya",
  description: "Conscious living, curated — products, knowledge, and experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Nav />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}