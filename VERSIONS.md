# ORBIT — Landing Page Versions

Version markers for the landing page work. Nothing here is pushed to GitHub;
everything is local until you say otherwise.

| Version | What it is | Where it lives |
|---|---|---|
| **version main** | The whole site exactly as it was before the v.l.01 landing page work started. This is the restore point. | git tag `version-main` (commit `8700358`), pushed to origin |
| **v.l.01** | The QR-card landing page at `/`, built on the BOTCORE design system from `DESIGN-SYSTEM-PROMPT.md`. **Live on orbitpk.com.** | git branch `v.l.01`, merged into `main` |

## Restoring

v.l.01 is merged into `main` and deployed, so `main` no longer holds the old
site — the `version-main` tag does.

**"Undo to main version"** — put orbitpk.com back exactly how it was before
v.l.01:

```bash
git checkout main
git reset --hard version-main
git push --force-with-lease origin main
```

Vercel redeploys from `main` and the old homepage is live again within a couple
of minutes. Nothing is lost: the `v.l.01` branch still holds all the work, so
you can put it back with:

```bash
git checkout main
git merge v.l.01
git push origin main
```

Prefer not to force-push? This does the same thing by moving forward instead,
which is safer on a shared branch:

```bash
git checkout main
git revert --no-commit 58b7a49
git commit -m "Revert to version main"
git push origin main
```

## What v.l.01 changed

**New — the landing page**

- `src/app/(landing)/` — layout + page for `/`. Own route group so it does not
  inherit the marketing site's navbar, footer, chat widget or theme toggle.
- `src/components/landing/` — all sections, self-contained.
- `src/styles/landing.css` — the design system, every rule scoped under `.ds`
  so it cannot leak into the rest of the app.
- `src/data/landing.ts` — contact details, capabilities, process steps.
- `src/app/api/vcard/route.ts` — serves `ORBIT.vcf` so a scan can save the
  contact to their phone in one tap.
- `public/images/landing/` — two Unsplash photos, downloaded locally.

**Moved**

- The previous home page moved from `/` to `/home` so both versions can be
  compared locally. It is `noindex` and out of the sitemap. Delete
  `src/app/(public)/home/` once v.l.01 is signed off.

**Edited**

- `tailwind.config.ts` — added the `orbit` colour namespace and three font
  families. Purely additive; no existing token changed.

Everything else — marketing pages, the freelancer marketplace, dashboards, AI
tools — is untouched.

## Accent colour

The reference design system uses neon green `#00FF00`. v.l.01 uses ORBIT orange
`#FF751F` instead, because this page is the destination for the QR code on the
printed card and needs to match the card's branding. §11 of the spec allows the
swap as long as the accent stays high-chroma and low-frequency.

To switch to the reference green, change two values:

- `--acc` and `--acc-rgb` in `src/styles/landing.css`
- `orbit.acc` in `tailwind.config.ts`

## Running locally

```bash
npm run dev
```

- `/` — v.l.01 landing page (the QR destination)
- `/home` — the previous landing page, for comparison
- `/api/vcard` — downloads `ORBIT.vcf`
