import { notFound } from "next/navigation";

/**
 * The admin segment is local tooling: a newsletter test harness, a motion
 * primitives showcase, and a mock test-results view. None of it is built for
 * public traffic, and `noindex` only keeps it out of search results — it does
 * not keep anyone out. In production the whole segment 404s.
 *
 * The API endpoints behind it carry their own `ADMIN_API_KEY` check
 * (`lib/security/admin-auth.ts`), so this is defence in depth rather than the
 * only lock.
 */
export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  return <>{children}</>;
}
