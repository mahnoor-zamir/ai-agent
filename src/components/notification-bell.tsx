"use client"

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LeadDetailsDialog } from "./lead-details-dialog"
import { Badge } from "@/components/ui/badge"

interface Lead {
  id: string
  name: string
  email: string
  timestamp: string
  emailPreview: string
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // This would typically come from your data fetching logic
  const flaggedLeads: Lead[] = [
    { id: '1', name: "David Brown", email: "david@example.com", timestamp: "2023-05-10T17:10:00Z", emailPreview: "Hi, I'm interested in booking a tour. What are your available dates?" },
    { id: '2', name: "Henry Wilson", email: "henry@example.com", timestamp: "2023-05-11T15:00:00Z", emailPreview: "Could you provide more information about your properties?" },
  ]

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {flaggedLeads.length > 0 && (
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 animate-pulse-scale" />
            )}
            <span className="sr-only">View notifications</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96">
          <h3 className="font-semibold mb-2">Leads Requiring Attention</h3>
          <ScrollArea className="h-[300px]">
            {flaggedLeads.map((lead) => (
              <div
                key={lead.id}
                className="mb-4 p-3 bg-[#fafafa] rounded-lg cursor-pointer hover:bg-[#f0f0f0]"
                onClick={() => {
                  setSelectedLead(lead)
                  setIsOpen(false)
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">AI Did Not Reply</Badge>
                </div>
                <p className="text-sm line-clamp-2">{lead.emailPreview}</p>
              </div>
            ))}
          </ScrollArea>
        </PopoverContent>
      </Popover>
      {selectedLead && (
        <LeadDetailsDialog
          lead={selectedLead}
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </>
  )
}

