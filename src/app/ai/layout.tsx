'use client'

export default function AILayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      {children}
    </div>
  )
}
