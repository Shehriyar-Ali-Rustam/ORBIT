# ORBIT — Landing Page Versions

Version markers for the landing page work. Nothing here is pushed to GitHub;
everything is local until you say otherwise.

| Version | What it is | Where it lives |
|---|---|---|
| **version main** | The whole site exactly as it was before any landing page work. This is the restore point. | git tag `version-main` (commit `8700358`), pushed to origin |
| **v.l.01** | QR-card landing page at `/`, **dark canvas**. Built on the BOTCORE design system from `DESIGN-SYSTEM-PROMPT.md`. Was live on orbitpk.com, then rolled back. | git branch `v.l.01`, pushed to origin |
| **v.l.02** | Same page and structure, **white canvas**. Palette moved onto CSS variables so light/dark is one switch. | git branch `v.l.02` |

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

## Light and dark

From v.l.02 the whole palette lives in CSS variables at the top of
`src/styles/landing.css`. Light is the default.

**To go back to the dark canvas:** add `ds-dark` to the wrapper div in
`src/app/(landing)/layout.tsx`. Every colour flips. The two photographs are the
one thing a class cannot flip — dark also wants
`/fotis-fotopoulos-6sAl6aQ4OWI-unsplash.jpg` in `Hero.tsx` and
`/images/landing/studio-desk.jpg` in `Process.tsx`, both still in the repo.

## Accent colour

The reference design system uses neon green `#00FF00`. Both versions use ORBIT
orange `#FF751F` instead, because this page is the destination for the QR code
on the printed card and needs to match the card's branding. §11 of the spec
allows the swap as long as the accent stays high-chroma and low-frequency.

On white, brand orange only reaches **2.7:1** against the background, which
fails WCAG AA. So v.l.02 carries two accent tokens:

- `--acc-rgb` — brand orange `#FF751F`, for fills (buttons, the CTA band) and
  for text sitting on a dark surface.
- `--acc-ink-rgb` — `#C2410C` at **5.1:1**, for every accent word, label, icon
  and rule that sits directly on the white canvas.

In the dark palette both resolve to the same brand orange. Every text node on
the page was checked against WCAG AA after the inversion; the dark theme's
opacity ladder does not survive it, so text alphas below 60% were raised.

## Running locally

```bash
npm run dev
```

- `/` — v.l.01 landing page (the QR destination)
- `/home` — the previous landing page, for comparison
- `/api/vcard` — downloads `ORBIT.vcf`
