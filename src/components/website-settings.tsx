"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface WebsiteSettingsProps {
  onLogin: (siteUrl: string, username: string, password: string) => Promise<void>
}

export function WebsiteSettings({ onLogin }: WebsiteSettingsProps) {
  const [siteUrl, setSiteUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await onLogin(siteUrl, username, password)
      setIsLoggedIn(true)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoggedIn) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Website Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Successfully connected to WordPress!</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <AccordionItem value="website-settings">
      <AccordionTrigger>Website Settings</AccordionTrigger>
      <AccordionContent>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Website Settings</CardTitle>
            <CardDescription>Enter your WordPress site details to connect</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="WordPress Site URL (e.g., https://example.com)"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect to WordPress'
                )}
              </Button>
            </form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  )
}