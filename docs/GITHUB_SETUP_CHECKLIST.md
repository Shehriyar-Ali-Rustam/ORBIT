# GitHub Repository Setup Checklist

Do these manually at https://github.com/Shehriyar-Ali-Rustam/ORBIT

## 1. Update repo description

Go to **Settings** (gear icon next to "About") and set:

**Description:**
```
AI-powered freelancer marketplace with 7 built-in AI tools, real-time messaging, and Stripe payments — Next.js 14, TypeScript, Supabase, Stripe, Clerk
```

## 2. Add topics

In the same "About" section, add these topics:
```
nextjs, typescript, freelancer-marketplace, ai-chatbot, supabase, stripe, tailwindcss, clerk, framer-motion, react
```

## 3. Fix website URL

The current URL (orbit-wheat-tau.vercel.app) returns 404. Either:
- Deploy to Vercel and update with the correct URL
- Remove the URL until deployment is fixed

## 4. Create GitHub Issues

Open `ISSUES_TO_CREATE.md` in this repo and create all 8 issues manually at:
https://github.com/Shehriyar-Ali-Rustam/ORBIT/issues/new

Copy the title, labels, and description for each one.

## 5. Add screenshots

After fixing deployment:
1. Create a `screenshots/` folder in the repo
2. Take screenshots of:
   - Landing page (hero section)
   - Marketplace browse page
   - AI tools page
   - Seller dashboard
   - Dark mode vs light mode comparison
3. Add them to the README under a "Screenshots" section

## 6. Optional extras

- [ ] Add a social preview image (Settings > Social preview) — 1280x640px
- [ ] Enable GitHub Discussions for community Q&A
- [ ] Set up GitHub Actions for CI (lint + build on PR)
- [ ] Pin the repo on your GitHub profile
