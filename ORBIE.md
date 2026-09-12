# Orbie

The bot-guided walkthrough at `/`. A first-time visitor arrives inside it: Orbie
introduces the studio, then hands over to a crossroads, and every section returns
there. Built as an extension of Story Mode rather than a replacement — see
`STORY-MODE.md` for the engine it grew out of, and `revamp.md` for the concept.

## Switching it on and off

`src/lib/orbie-flags.ts`:

| Flag | Default | Effect |
|---|---|---|
| `ORBIE_ENABLED` | **true** | A first-time visitor at `/` lands in the tour. `false` falls back to Story Mode, and Orbie is reachable only at `/?orbie=1`. |
| `ORBIE_CHAT_ENABLED` | `false` | Free-form "ask me anything". The only part that costs money per visit. |
| `ORBIE_AUDIO_ENABLED` | `false` | Narration audio. Swaps the timeline clock for the audio clock. |
| `ORBIE_3D_ENABLED` | `false` | The 3D character. `three` never enters the bundle while this is off. |

`/?orbie=1` always plays, regardless of any of them.

To remove the feature entirely: delete `src/components/orbie/`,
`src/data/orbie-graph.ts`, `src/data/orbie-contact.ts`, `src/lib/orbie-flags.ts`,
and the `<OrbieEntry />` line in `src/app/(landing)/page.tsx`.

## Editing the script

Everything Orbie says is in **`src/data/orbie-graph.ts`**. Nothing there imports
engine code.

```ts
'svc-web': {
  id: 'svc-web',
  chapter: 'services',
  view: 'services',
  focus: 'web-development',        // a slug from services.ts
  narration: '...',                // the full spoken line — feed this to a TTS verbatim
  lines: [{ text: '...', atMs: 0 }],
  advance: { kind: 'auto', durationMs: 4200 },
  next: 'svc-mobile',
  pose: 'idle',
  emotion: 'neutral',
  repeat: { narration: '...', lines: [...] },   // for a visitor who has been here before
}
```

Two rules, both enforced:

1. **A typo'd `to:` or `next:` is a compile error.** `NodeId` derives from the
   `NODE_IDS` array, so `to: 'crossroadz'` fails the build with a did-you-mean.
2. **No digits in narration.** `src/data` is canonical for facts; a typed "10" is
   a second copy of a number that already lives in `portfolio.ts`. Interpolate it,
   or spell it with `spell()` — spoken narration wants "ten" anyway. A dev-only
   warning fires if you slip.

Three more checks run in the browser console in development: every node reachable
from `arrival`, every `hold` node has options, every `auto` node has a `next`.

### `advance`

- `{ kind: 'auto', durationMs }` — narrate, then move to `next`.
- `{ kind: 'hold', durationMs? }` — narrate, then park and wait for a choice.
  A `hold` with no `options` is a dead end and warns.

## Adding narration audio

1. Freeze the script first. Regenerating clips after every copy edit is the
   failure mode this is deferred for.
2. Generate one MP3 per node from its `narration` string, using any TTS provider.
   Mono, ~96 kbps. Save as `public/orbie/audio/<nodeId>.mp3` and set `audio` on
   the node.
3. Flip `ORBIE_AUDIO_ENABLED`.

`useAudioClock` returns the identical `StoryClock` shape as the timeline clock,
so no scene, caption, progress bar or navigator changes. A node with no clip
falls back to its `durationMs`, so a partial set degrades rather than breaks.

**Sound is muted by default and that is not a preference** — browsers block
autoplay with sound until a gesture. Unmute from the visitor's first tap, never
on mount.

## Turning on chat

Needs three things: `ORBIE_CHAT_ENABLED = true`, a model key
(`ANTHROPIC_API_KEY`, or Groq/Gemini/OpenAI — see `src/lib/ai/router.ts`), and
Upstash credentials.

That last one is not optional. Orbie's endpoint **fails closed**: with no
limiter configured it refuses rather than running uncapped. `enforceRateLimit`
fails *open*, which is right for a contact form and wrong for anything billed
per call.

Other controls: 12 requests/hour per IP, 400 max tokens, history truncated to the
last 6 turns, send disabled while streaming.

The persona is `ORBIE_IDENTITY` in `src/lib/ai/prompts.ts` — deliberately not the
shared `BASE_IDENTITY`, which pushes `/freelancers` and `/ai` (both parked) and is
written for a chat window rather than a speech bubble.

## The 3D character

`src/components/orbie/character/Orbie3D.tsx` is the swap point. It renders the 2D
character today, so flipping the flag now would still be correct.

When a model arrives: `pose` maps to named glTF clips (one-shots use
`clampWhenFinished` and fire `onPoseEnd` from the mixer's `finished` event),
`emotion` drives the visor material, `speaking` is read per frame inside
`useFrame`, and `size` maps to one of three fixed canvas aspects.

**Do not flip the flag for a GLB over ~1.5 MB Draco-compressed.** The 2D
character is the product, not a placeholder. `/` is the URL printed on the
business card.

## Architecture notes

- **One clock.** `useStoryClock.ts` splits *when a node ends* (`advance`) from
  *what comes next* (`onNodeEnd`). That split is what lets the same hook drive
  Story Mode's line and Orbie's graph.
- **The graph sits above the clock.** `useOrbieNavigator` resolves a node id to
  an index and calls `seekScene`; the clock never learns what an edge is.
- **Browser Back walks the tour**, via `pushState` per node. Without it a phone's
  back gesture exits the site mid-tour.
- **The contact brief validates with the server's own schema** —
  `contactSchema.shape[step].safeParse(value)`. Not a copy, the same validator
  `POST /api/contact` enforces.
- **`/` is never rendered server-side by Orbie.** The landing page stays in the
  HTML underneath, which is what keeps the site indexable.
- **`/` budget: 165 kB First Load JS**, against a 185 kB ceiling. Everything is
  behind a dynamic import. Check it on every change.

## Analytics

Via `track()` from `@vercel/analytics`: `orbie_start`, `orbie_node`,
`orbie_pick`, `orbie_exit`, `orbie_dock`, `orbie_chat_ask`.

Watch `orbie_exit` on the `arrival` node. A high rate there means the tour is a
toll booth in front of the business card, and the fallback is moving it to
`/tour`.
