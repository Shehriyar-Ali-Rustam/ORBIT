// ── Feature flags ────────────────────────────────────────────────────
// Flip a flag to `true` to bring that section back online. While `false`,
// its routes render the shared "Coming Soon" screen.

// Freelancer marketplace (/freelancers/*). Before re-enabling, make sure
// the marketplace tables exist in the active Supabase project
// (run supabase/schema.sql).
export const MARKETPLACE_ENABLED = false

// Orbit AI tools (/ai/*). Gated for now to control model API costs.
// Flip to true once the tools are ready to serve traffic.
export const AI_ENABLED = false
