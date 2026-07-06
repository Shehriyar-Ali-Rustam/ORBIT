# Security Policy

ORBIT takes the security of its software seriously. If you believe you've found a security vulnerability in orbitpk.com or in this repository, we appreciate your help disclosing it responsibly.

## Reporting a vulnerability

**Please do NOT open a public GitHub issue.**

Instead, email **info@orbitpk.com** with the subject line:

```
[SECURITY] Brief description
```

Include:
- A clear description of the vulnerability
- Reproduction steps (proof-of-concept, screenshots, or a minimal repro)
- The impact you believe it has
- Any suggested fix, if you have one

You'll get a first-response acknowledgement within **48 hours** during weekdays (Pakistan Standard Time, UTC+5) and an initial triage within **5 business days**.

We commit to:
- Not taking legal action against researchers who report in good faith and comply with this policy
- Keeping you updated on remediation progress
- Publicly crediting you in release notes once the issue is fixed (unless you prefer to remain anonymous)

## Scope

The following are in scope:
- `orbitpk.com` and all subdomains
- The main repository ([Shehriyar-Ali-Rustam/ORBIT](https://github.com/Shehriyar-Ali-Rustam/ORBIT))
- Server-side APIs at `orbitpk.com/api/*`
- The freelancer marketplace at `orbitpk.com/freelancers/*`

Out of scope (please don't test):
- Denial of service against production
- Physical or social-engineering attacks
- Third-party services we don't operate (Clerk, Supabase, Stripe, Vercel — report those to the respective vendors)

## Incident response — internal runbook

If a secret is exposed or a live vulnerability is being exploited:

1. **Identify** — confirm scope. Which key, which endpoint, which users?
2. **Rotate** — invalidate the exposed credential in the source system (Clerk/Stripe/Supabase/Gmail/etc.). Deploy the new value to Vercel env vars. Redeploy.
3. **Invalidate sessions** — Clerk → Sessions → revoke all if the compromise touches auth.
4. **Notify** — if user data may have been accessed, notify affected users within 72 hours (GDPR / general good practice).
5. **Post-mortem** — write it up in `docs/meetings/YYYY-MM-DD-incident-*.md` including timeline, impact, root cause, and follow-up actions. No blame — process fixes only.

## Supported versions

We ship from `main`. Only the latest deployment on Vercel receives security patches. Previous commits are historical only.

## Security posture

For our per-pillar security audit against the VibeSec playbook, see:
- [`docs/technical/security-audit-2026-07.md`](./docs/technical/security-audit-2026-07.md)
- [`docs/technical/SECURITY-PLAYBOOK.md`](./docs/technical/SECURITY-PLAYBOOK.md)
