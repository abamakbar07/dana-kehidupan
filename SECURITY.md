# Security Baseline

- Secure cookies (SameSite=Strict), httpOnly, Secure in production
- CSP via next-safe-middleware (tighten for production)
- CSRF: Prefer same-site cookies and POST-only server actions; REST routes should verify auth and origin when expanded
- Input validation using Zod in all server actions and REST endpoints
- Server-side logging only; avoid PII in client logs
- Rate limiting: hook in IP + user limiter for sensitive routes (stubbed; integrate Upstash or Redis token bucket)
- File uploads: content type check and size limits (5MB default)
- Audit logs for data-changing operations (extend as features grow)

## Threat Model Checklist

- Auth bypass attempts (ensure NextAuth session checks before privileged ops)
- CSRF on REST endpoints (enforce same-origin or CSRF tokens)
- XSS via unescaped content (sanitize rich text; avoid dangerouslySetInnerHTML)
- SSRF via remote file URLs (disallow server-side fetching of arbitrary user URLs)
- DoS via heavy queries or huge files (pagination, size limits, rate limiting)
- Secrets: .env ignored; rotate in prod; use secret manager
