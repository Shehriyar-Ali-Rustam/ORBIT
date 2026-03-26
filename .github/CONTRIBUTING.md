# Contributing to ORBIT

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/ORBIT.git
   cd ORBIT
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required keys (Supabase, Clerk, Stripe, Groq).
5. **Start the dev server:**
   ```bash
   npm run dev
   ```

## Making Changes

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test locally — ensure `npm run build` passes with no errors
4. Commit with a clear message describing what you changed and why

## Code Style

- **TypeScript** — all new files should be `.ts` or `.tsx`
- **Tailwind CSS** — use utility classes; follow existing patterns for theming (`var(--color-*)`)
- **Framer Motion** — use for animations; keep them subtle and performant
- **Components** — place in `components/` with the appropriate subdirectory (ui, sections, marketplace, etc.)
- **API routes** — validate inputs with Zod, use proper error responses
- **No `any` types** unless absolutely necessary — prefer explicit types from `types/`

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Include a clear title and description of what changed
- Reference any related issues (e.g., "Closes #12")
- Make sure `npm run build` and `npm run lint` pass
- Add screenshots for UI changes

## Reporting Issues

Use GitHub Issues to report bugs or request features. Include:
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable
- Browser/device info for UI bugs

## Questions?

Open a GitHub Discussion or reach out to [@Shehriyar-Ali-Rustam](https://github.com/Shehriyar-Ali-Rustam).
