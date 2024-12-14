"use client"

import { useState } from 'react'
import { WordPressLogin } from "@/components/wordpress-login"
import { WordPressEditor } from "@/components/wordpress-editor"
import { Button } from "@/components/ui/button"
import { WebsiteSEOAudit } from "@/components/website-seo-audit"
import { WebsiteAIChat } from "@/components/website-ai-chat"
import { Sparkles } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function WebsitePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [wpCredentials, setWpCredentials] = useState<{ siteUrl: string; username: string; password: string } | null>(null)
  const [showSEOAudit, setShowSEOAudit] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)

  const handleLogin = async (siteUrl: string, username: string, password: string) => {
    console.log("Logging in with:", { siteUrl, username, password })
    setWpCredentials({ siteUrl, username, password })
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setWpCredentials(null)
  }

  const handleSEOAudit = () => {
    setShowSEOAudit(true)
  }

  const handleAIChat = () => {
    setShowAIChat(true)
  }

  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">Website Management</h1> {/* Title updated */}
        <p className="text-lg text-muted-foreground">Manage your website content and settings</p> {/* Description updated */}
      </div>

      {/* Conditionally render editor or placeholder based on login state */}
      {isLoggedIn && wpCredentials ? (
        <div className="space-y-6">
          <div className="flex justify-end space-x-4"> {/* Button group container */}
            <Button onClick={handleSEOAudit}>Run SEO Audit</Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleAIChat}>
                    <Sparkles className="h-4 w-4 text-[#0042af]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI Chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <WordPressEditor {...wpCredentials} />
        </div>
      ) : (
        <p>Please connect to your WordPress site in the settings to manage your website content.</p> // Placeholder message
      )}

      <WebsiteSEOAudit isOpen={showSEOAudit} onClose={() => setShowSEOAudit(false)} />
      <WebsiteAIChat isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
    </div>
  )
}

