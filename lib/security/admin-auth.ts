import { NextResponse } from "next/server";

/**
 * Shared gate for the newsletter admin endpoints.
 *
 * Fails closed: with no `ADMIN_API_KEY` configured there is no valid request,
 * so a deployment that forgets the variable serves 401s rather than serving
 * subscriber data to anyone who finds the URL. This is the check
 * `/api/newsletter/export` already used; `stats` and `analytics` return the
 * same business data in aggregate and had no check at all.
 */
export function isAdminRequest(request: Request): boolean {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) return false;

  return request.headers.get("authorization") === `Bearer ${expected}`;
}

/** The 401 every admin endpoint returns, so they cannot drift apart. */
export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
