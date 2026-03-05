import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { CursorGlow } from '@/components/ui/CursorGlow'
import { Preloader } from '@/components/ui/Preloader'
import { ScrollProgress } from '@/components/ui/ScrollProgress'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Preloader />
      <ScrollProgress />
      <GrainOverlay />
      <CursorGlow />
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <ChatWidget />
    </AuthProvider>
  )
}
