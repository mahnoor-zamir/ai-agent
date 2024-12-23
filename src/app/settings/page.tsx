"use client"

import { useState, useEffect } from "react"
import { EmailSettings } from "@/components/email-settings"
import { WebsiteSettings } from "@/components/website-settings"
import ErrorBoundary from "@/components/error-boundary"
import { Accordion } from "@/components/ui/accordion"

export default function SettingsPage() {
  const [isGmailConnected, setIsGmailConnected] = useState(false)
  const [isOutlookConnected, setIsOutlookConnected] = useState(false)

  useEffect(() => {
    // Check the authentication status from your backend or local storage
    const checkAuthStatus = async () => {
      // Replace with your actual logic to check authentication status
      const gmailStatus = localStorage.getItem("isGmailConnected") === "true"
      const outlookStatus = localStorage.getItem("isOutlookConnected") === "true"
      setIsGmailConnected(gmailStatus)
      setIsOutlookConnected(outlookStatus)
    }
    checkAuthStatus()
  }, [])

  const handleLogin = async (siteUrl: string, username: string, password: string) => {
    console.log("Logging in with:", { siteUrl, username, password })
    // Add your login logic here
  }

  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-lg text-muted-foreground">Configure your settings</p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        <ErrorBoundary fallback={<div>Something went wrong in the Email Settings.</div>}>
          <EmailSettings />
        </ErrorBoundary>
        <ErrorBoundary fallback={<div>Something went wrong in the Website Settings.</div>}>
          <WebsiteSettings onLogin={handleLogin} />
        </ErrorBoundary>
      </Accordion>
    </div>
  )
}