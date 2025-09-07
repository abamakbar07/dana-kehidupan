import { nextSafe } from "next-safe-middleware";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next|.*\\.\
(?:png|jpg|jpeg|svg|ico|webmanifest|js|css)).*)"]
};

export function middleware(req: Request) {
  const res = nextSafe({
    contentSecurityPolicy: {
      "img-src": ["'self'", "data:"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "connect-src": ["'self'"],
    }
  })(req);
  return res ?? NextResponse.next();
}

