"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface WebsiteSEOAuditProps {
  isOpen: boolean
  onClose: () => void
}

export function WebsiteSEOAudit({ isOpen, onClose }: WebsiteSEOAuditProps) {
  const [progress, setProgress] = useState(0)
  const [isAuditing, setIsAuditing] = useState(false)

  const handleStartAudit = async () => {
    setIsAuditing(true)
    setProgress(0) // Reset progress

    // Simulate an API call to perform the audit
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate delay
      setProgress(i)
    }

    setIsAuditing(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Website SEO Audit</DialogTitle>
          <DialogDescription>
            Click the button below to start the audit.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={handleStartAudit} disabled={isAuditing}>
            {isAuditing ? 'Auditing...' : 'Start Audit'}
          </Button>
          {isAuditing && <Progress value={progress} />}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

