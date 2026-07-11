// ── Feature flags ────────────────────────────────────────────────────
// Flip MARKETPLACE_ENABLED to `true` to bring the freelancer marketplace
// back online. While `false`, every /freelancers/* route renders the
// "Coming Soon" screen and the marketplace auth redirects are skipped.
//
// Before re-enabling: make sure the marketplace tables exist in the
// active Supabase project (run supabase/schema.sql).
export const MARKETPLACE_ENABLED = false
