import { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"

interface FollowUp {
  name: string
  email: string
  scheduledFor: string
  type: string
  source: string
  responseTime: string
  engagementLevel: string
  timeline: string
  emotionalConnection: string
}

interface UpcomingFollowupsDialogProps {
  isOpen: boolean
  onClose: () => void
  followUps: FollowUp[]
}

const calculateLeadScore = (followUp: FollowUp): number => {
  let score = 0;

  // 1. Inquiry Source (20%)
  if (["Website Form", "WeddingWire", "The Knot"].includes(followUp.source)) {
    score += 20;
  } else if (["Organic Search", "Social Media"].includes(followUp.source)) {
    score += 10;
  } else {
    score += 5;
  }

  // 2. Response Time (25%)
  if (followUp.responseTime === "Quick") {
    score += 25;
  } else if (followUp.responseTime === "Moderate") {
    score += 15;
  } else {
    score += 5;
  }

  // 3. Engagement Level (20%)
  if (followUp.engagementLevel === "High") {
    score += 20;
  } else if (followUp.engagementLevel === "Moderate") {
    score += 10;
  } else {
    score += 5;
  }

  // 4. Decision Timeline (15%)
  if (followUp.timeline === "Clear") {
    score += 15;
  } else if (followUp.timeline === "Flexible") {
    score += 10;
  } else {
    score += 5;
  }

  // 5. Emotional Connection (20%)
  if (followUp.emotionalConnection === "Strong") {
    score += 20;
  } else if (followUp.emotionalConnection === "Moderate") {
    score += 10;
  } else {
    score += 5;
  }

  return score;
};

export function UpcomingFollowupsDialog({ isOpen, onClose, followUps }: UpcomingFollowupsDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFollowUps = followUps.filter(followUp =>
    followUp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    followUp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    followUp.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full h-[80vh] flex flex-col p-0 overflow-hidden">
        <div className="flex items-center p-6 border-b">
          <DialogTitle className="text-2xl font-bold">All Upcoming Follow-ups</DialogTitle>
        </div>
        <div className="p-6 space-y-4 flex-grow flex flex-col overflow-hidden">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search follow-ups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <ScrollArea className="flex-grow h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Lead Score</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFollowUps.map((followUp, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{followUp.name}</TableCell>
                    <TableCell>{followUp.email}</TableCell>
                    <TableCell>{format(new Date(followUp.scheduledFor), 'MMM d, yyyy HH:mm')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={followUp.type === 'First Follow-up' ? 'default' : 'secondary'}
                        className={followUp.type === 'First Follow-up' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : ''}
                      >
                        {followUp.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        calculateLeadScore(followUp) >= 80 ? 'bg-green-100 text-green-800' :
                        calculateLeadScore(followUp) >= 60 ? 'bg-blue-100 text-blue-800' :
                        calculateLeadScore(followUp) >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {calculateLeadScore(followUp)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group"
                        onClick={() => {/* Implement AI summary action */}}
                      >
                        <Sparkles className="h-4 w-4 text-[#0042af] group-hover:animate-pulse-scale" />
                        <span className="ml-2">View Summary</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

