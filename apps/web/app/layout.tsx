import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import Script from "next/script";
import { Providers } from "../components/Providers";

export const metadata = {
  title: "Dana Kehidupan",
  description: "Personal finance web app",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <Providers>
          <div className="flex min-h-screen">
            <aside className="hidden w-64 border-r border-slate-200 p-4 md:block">
              <div className="mb-4 text-lg font-bold">Dana Kehidupan</div>
              <nav className="flex flex-col gap-2 text-sm">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/accounts">Accounts</Link>
                <Link href="/transactions">Transactions</Link>
                <Link href="/budgets">Budgets</Link>
                <Link href="/reports">Reports</Link>
                <Link href="/goals">Goals</Link>
                <Link href="/debts">Debts</Link>
                <Link href="/settings">Settings</Link>
              </nav>
            </aside>
            <main className="flex-1 p-4 md:p-8">
              <header className="mb-6 flex items-center justify-between">
                <div className="font-semibold">Welcome</div>
                <nav className="flex items-center gap-3 text-sm">
                  <Link href="/api/auth/signin">Sign in</Link>
                  <Link href="/api/auth/signout">Sign out</Link>
                </nav>
              </header>
              {children}
            </main>
          </div>
        </Providers>
        <Script id="sw-register" strategy="afterInteractive">{
          `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js').catch(()=>{}); }`
        }</Script>
      </body>
    </html>
  );
}
