"use client"

import { useRouter } from 'next/navigation'
import { ProfileDropdown } from "@/components/profile-dropdown"

interface ClientHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

export function ClientHeader({ user }: ClientHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Implement logout logic here
    console.log("User logged out")
    // Example: redirect to login page
    router.push('/login')
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-end">
        <ProfileDropdown user={user} onLogout={handleLogout} />
      </div>
    </header>
  )
}