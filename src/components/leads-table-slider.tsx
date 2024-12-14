import { useState } from 'react'
import { format } from 'date-fns'
import { Search } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Lead {
  name: string
  email: string
  status: string
  timestamp: string
}

interface LeadsTableSliderProps {
  isOpen: boolean
  onClose: () => void
  leads: Lead[]
}

export function LeadsTableSlider({ isOpen, onClose, leads }: LeadsTableSliderProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>All Leads Handled by AI</SheetTitle>
          <SheetDescription>
            A comprehensive list of all leads handled by the AI agent.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  )
}

