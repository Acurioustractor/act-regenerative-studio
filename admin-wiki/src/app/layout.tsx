import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ACT Ecosystem Admin',
  description: 'Administrative dashboard for The Harvest, ACT Farm, Empathy Ledger, and JusticeHub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased">{children}</body>
    </html>
  )
}
