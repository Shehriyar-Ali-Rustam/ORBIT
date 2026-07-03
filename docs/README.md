# ORBIT Documentation

Internal documentation for ORBIT. Everything the team needs to run the company and the product lives here.

## Structure

| Folder | What goes here |
|--------|----------------|
| [`business/`](./business) | Company vision, mission, strategy, org info, pitch decks, brand story |
| [`product/`](./product) | Feature specs, roadmap, product requirements documents (PRDs), user research |
| [`technical/`](./technical) | Architecture diagrams, API docs, database schemas, integration guides |
| [`design/`](./design) | Brand guidelines, logo assets, UI/UX mockups, style guides, color palettes |
| [`operations/`](./operations) | Deployment runbooks, CI/CD workflows, onboarding, team processes |
| [`marketing/`](./marketing) | Content strategy, SEO plans, social media campaigns, launch checklists |
| [`legal/`](./legal) | Privacy policy drafts, terms of service, contracts, compliance notes |
| [`clients/`](./clients) | Client proposals, contracts, invoices, meeting notes (per-client subfolders) |
| [`meetings/`](./meetings) | Team meeting notes, decisions log, retrospectives |

## Conventions

- Use Markdown (`.md`) for text documents whenever possible — versioned nicely in Git
- PDFs, images, and other binaries are fine — commit them but keep sizes reasonable
- For client-specific docs, create a subfolder per client: `clients/acme-corp/`, `clients/xyz-startup/`
- Date-stamp meeting notes: `meetings/2026-05-16-weekly-standup.md`
- Never commit secrets, API keys, or passwords to any doc here — use environment variables

## Sensitive documents

If a document contains confidential business info (finances, unreleased strategy, personal data), consider whether the GitHub repo is the right place — it's private but anyone with repo access can see it. For truly sensitive material, use Google Drive with tighter permissions instead.
