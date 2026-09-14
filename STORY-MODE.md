# Story Mode

A narrated, Instagram-Stories-style tour that plays over the landing page. Five
full-screen scenes, about 29 seconds, with an exit visible at every moment.

It is a **layer**, not a replacement. `/` renders exactly as it always has;
nothing here appears in the server-rendered HTML, so the classic site remains
the SEO surface.

## Switching it on and off

`src/lib/story-flags.ts`:

| Flag | Effect |
|---|---|
| `STORY_ENABLED` | `false` (default) — `/` behaves normally and the story is reachable only at `/?story=1`. `true` — every first-time visitor sees the choice screen. |
| `STORY_AUDIO_ENABLED` | Reserved. See *Adding narration* below. |

`?story=1` works regardless of the flag, which is how you review it in
production before switching it on for visitors.

To remove the feature entirely: delete `src/components/story/`,
`src/data/storyboard.ts`, `src/lib/story-flags.ts`, and the `<StoryGate />`
line in `src/app/(landing)/page.tsx`. Nothing else references it.

## Editing the script

Everything the story says lives in **`src/data/storyboard.ts`**, and nothing in
that file is engine code.

```ts
{
  id: 'welcome',
  narration: "Hi, I'm Orbit AI. …",   // the full line; feed this to a TTS verbatim
  lines: [                             // the same words, split for on-screen reveal
    { text: "Hi, I'm Orbit AI.", atMs: 0 },
    { text: 'Welcome to Orbit Innovations.', atMs: 1400 },
  ],
  durationMs: 5000,
}
```

- `atMs` is an offset from the **start of that scene**, not the story.
- Reordering scenes is reordering the array. The progress bar counts itself.
- The project count is derived from `src/data/portfolio.ts` — add an eleventh
  project and the narration says "Eleven". Do not type a number here; the site
  already contradicts itself about how many projects exist and this is the worst
  place to add another version of that.
- If you change total runtime, update `STORY_SECONDS` in `src/lib/story-flags.ts`.
  A dev-only warning fires if the two drift apart.

## Adding narration audio

The engine runs on a timeline clock today. Everything on screen reads from one
clock (`src/components/story/useStoryClock.ts`), so adding voice does not touch
the scenes, captions or progress bar.

1. Generate one MP3 per scene from each `narration` string, using any TTS
   provider (ElevenLabs, OpenAI, Google). Mono, ~96 kbps is plenty for speech.
2. Save them as `public/story/audio/01-welcome.mp3` … `05-cta.mp3` and set the
   `audio` field on each scene.
3. Write `useAudioClock` alongside `useTimelineClock`, returning the same
   `StoryClock` shape — read `audio.currentTime` for `elapsedMs`, advance on the
   `ended` event.
4. Flip `STORY_AUDIO_ENABLED` and swap the hook in `StoryPlayer.tsx`.
5. In `AIScene`'s narration, change "voice assistants" to "voice assistants like
   me". It is only true once Orbit AI actually speaks.

**Audio cannot autoplay with sound.** Browsers block it until the user
interacts. The tap on "Take the tour" is that interaction, so start playback in
that handler — never on mount.

## Controls

| Input | Action |
|---|---|
| Tap right 70% | Next scene |
| Tap left 30% | Previous (first press restarts the current scene, like Instagram) |
| Press and hold | Pause; release resumes |
| `Space` | Pause / resume |
| `←` `→` | Previous / next |
| `Esc` | Exit |

Tap navigation is disabled on the final scene so a stray tap cannot skip past
the call to action.

## Architecture notes

- **One clock.** `useStoryClock.ts` drives scene timing, the progress bar and
  caption sync. Nothing keeps a timer of its own, which is what stops the three
  from drifting apart.
- **Progress is a `MotionValue`, not React state.** The bar needs a per-frame
  value; putting that in state would re-render the story 60 times a second.
- **The player is code-split.** `/` is the printed QR code's destination, so the
  player and its scenes load on the tap that opens them, not on every visit.
  Cost of the gate alone is ~2.4 kB.
- **`useSearchParams()` is deliberately not used.** It would opt `/` into dynamic
  rendering; the query param is read from `window.location` instead so the page
  stays static.
- **`dvh`, never `vh`.** iOS Safari's toolbar makes `100vh` taller than the
  visible viewport, which would push the controls off screen.
- Every animated component calls `useReducedMotion()`. The global CSS
  `prefers-reduced-motion` block in `globals.css` does not reach Framer Motion,
  which animates in JS.

## Analytics

Events go through `track()` from `@vercel/analytics`: `story_start`,
`scene_view`, `story_complete`, `story_exit`, `cta_lets_talk`.

Watch `story_exit` on the `welcome` scene. A high rate there means the choice
screen is a toll booth in front of the QR-code journey, and the fallback is
moving the story to its own `/tour` route.
