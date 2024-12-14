import { useState } from 'react'
import { format } from 'date-fns'
import { Search } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Lead {
  name: string
  email: string
  status: string
  timestamp: string
  source: string
  responseTime: string
  engagementLevel: string
  timeline: string
  emotionalConnection: string
}

interface LeadsTableDialogProps {
  isOpen: boolean
  onClose: () => void
  leads: Lead[]
}

const calculateLeadScore = (lead: Lead): number => {
  //Implementation from app/page.tsx would go here.  This is a placeholder.
  let score = 0;
  if (lead.status === 'Tour Scheduled') score += 30;
  if (lead.responseTime === 'Immediate') score += 20;
  if (lead.engagementLevel === 'High') score += 20;
  if (lead.timeline === 'Short') score += 10;
  if (lead.emotionalConnection === 'Strong') score += 20;
  return score;
};


export function LeadsTableDialog({ isOpen, onClose, leads }: LeadsTableDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full h-[80vh] flex flex-col p-0 overflow-hidden">
        <div className="flex items-center p-6 border-b">
          <DialogTitle className="text-2xl font-bold">All Leads Handled by AI</DialogTitle>
          {/* <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button> */}
        </div>
        <div className="p-6 space-y-4 flex-grow flex flex-col overflow-hidden">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
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
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Lead Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={lead.status === 'Tour Scheduled' ? 'default' : 'secondary'}
                        className={lead.status === 'Tour Scheduled' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : ''}
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(lead.timestamp), 'MMM d, yyyy HH:mm')}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        calculateLeadScore(lead) >= 80 ? 'bg-green-100 text-green-800' :
                        calculateLeadScore(lead) >= 60 ? 'bg-blue-100 text-blue-800' :
                        calculateLeadScore(lead) >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {calculateLeadScore(lead)}
                      </Badge>
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

