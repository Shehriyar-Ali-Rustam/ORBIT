import { STORY_ENABLED, STORY_QUERY_PARAM, STORY_REPLAY_EVERY_VISIT, STORY_SEEN_KEY } from '@/lib/story-flags'

/**
 * The pre-paint cover.
 *
 * The player is a client component behind a dynamic import, so between first
 * paint and the player mounting there is a window — short, but plainly visible
 * on a phone — where the landing page is on screen. Without this, the story
 * arrives *after* the homepage and reads as a modal that opened late. With it,
 * the story is simply what loaded.
 *
 * It is deliberately dumb: a server-rendered div with inline styles, plus one
 * script that removes it again before paint if this visitor should not see the
 * story. No React, no hydration, nothing to wait for.
 *
 * Two escape hatches are built in, because a full-screen cover that fails to
 * clear is the worst bug this feature could have:
 *
 *   - `<noscript>` hides it outright. JavaScript off means no story, so the
 *     visitor gets the landing page rather than a blank orange screen.
 *   - The script self-clears after 4s regardless. If the player chunk fails to
 *     load — offline, blocked, a bad deploy — the visitor still gets the site.
 */
export function StoryCover() {
  if (!STORY_ENABLED) return null

  // Runs before paint, inline, with no dependencies. Mirrors the theme script
  // already in the root layout.
  const script = `
(function(){
  try{
    var c=document.getElementById('story-cover');
    if(!c)return;
    var forced=new URLSearchParams(location.search).get(${JSON.stringify(STORY_QUERY_PARAM)})==='1';
    var seen=false;
    try{seen=localStorage.getItem(${JSON.stringify(STORY_SEEN_KEY)})==='1';}catch(e){}
    if(!forced&&seen&&!${STORY_REPLAY_EVERY_VISIT}){c.remove();return;}
    document.documentElement.classList.add('story-covered');
    // Failsafe: never leave a visitor staring at a cover that outlived its player.
    setTimeout(function(){
      var el=document.getElementById('story-cover');
      if(el)el.remove();
      document.documentElement.classList.remove('story-covered');
    },4000);
  }catch(e){
    var el=document.getElementById('story-cover');
    if(el)el.remove();
  }
})();`

  return (
    <>
      <div
        id="story-cover"
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 95,
          background: 'rgb(var(--canvas-rgb))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* A branded hold rather than a blank screen. */}
        <svg viewBox="0 0 32 32" width="56" height="56" aria-hidden focusable="false">
          <circle cx="17.5" cy="18" r="10.5" fill="none" stroke="rgb(var(--ink-rgb))" strokeWidth="1.6" opacity="0.35" />
          <circle cx="9" cy="8.5" r="6.4" fill="rgb(var(--canvas-rgb))" />
          <circle cx="9" cy="8.5" r="3.6" fill="none" stroke="rgb(var(--acc-rgb))" strokeWidth="3.2" />
        </svg>
      </div>

      <noscript>
        {/* No JavaScript means no story. Show the site, not a blank cover. */}
        <style>{`#story-cover{display:none!important}`}</style>
      </noscript>

      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  )
}
