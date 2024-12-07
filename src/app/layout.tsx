import { Metadata } from "next"
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { ClientHeader } from "@/components/client-header"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Sales Agent Dashboard",
  description: "Track your AI agent's performance and follow-up metrics",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mock user data - in a real application, this would come from your authentication system
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    image: "/placeholder.svg?height=32&width=32",
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <ClientHeader user={user} />
          <main className="flex-1">{children}</main>
          <Toaster />
        </div>
      </body>
    </html>
  )
}