import { AI_ENABLED } from '@/lib/flags'
import { ComingSoon } from '@/components/ComingSoon'

export default function AILayout({ children }: { children: React.ReactNode }) {
  // Orbit AI is gated while we control model API costs. Flip AI_ENABLED in
  // src/lib/flags.ts to bring the tools back online.
  if (!AI_ENABLED) {
    return (
      <ComingSoon
        label="Orbit AI"
        description="A suite of built-in AI tools - chat, writing, code, image generation, and more. We're getting them ready to handle real traffic. Check back soon."
      />
    )
  }
  return <div className="flex h-screen bg-background">{children}</div>
}
