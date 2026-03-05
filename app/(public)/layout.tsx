import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { AuthProvider } from '@/components/providers/AuthProvider'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <ChatWidget />
    </AuthProvider>
  )
}
