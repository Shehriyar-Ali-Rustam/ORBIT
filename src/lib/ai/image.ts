/**
 * Build a Pollinations AI image URL from a prompt.
 * Pollinations is 100% free — no API key needed.
 * The URL IS the API: images generate when the browser loads the URL.
 */
export function buildImageUrl(
  prompt: string,
  options: {
    width?: number
    height?: number
    seed?: number
  } = {}
): string {
  const { width = 1024, height = 1024, seed = Math.floor(Math.random() * 999999) } = options
  const encoded = encodeURIComponent(prompt)
  return (
    `https://image.pollinations.ai/prompt/${encoded}` +
    `?width=${width}&height=${height}&model=flux&nologo=true&enhance=true&seed=${seed}`
  )
}
