/**
 * The ORBIT mark, drawn rather than loaded from /logo.png.
 *
 * The PNG is a white ring with an orange satellite — built for a dark canvas,
 * and completely invisible on a white one. Redrawing it in SVG lets the orbit
 * ring inherit the theme's ink colour while the satellite keeps brand orange,
 * so the same mark works on either palette.
 */
export default function OrbitMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false">
      {/* orbit path */}
      <circle
        cx="17.5"
        cy="18"
        r="10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.9"
      />
      {/* knock the ring out behind the satellite so they read as separate bodies */}
      <circle cx="9" cy="8.5" r="6.4" fill="rgb(var(--canvas-rgb))" />
      {/* satellite */}
      <circle
        cx="9"
        cy="8.5"
        r="3.6"
        fill="none"
        stroke="rgb(var(--acc-rgb))"
        strokeWidth="3.2"
      />
    </svg>
  )
}
