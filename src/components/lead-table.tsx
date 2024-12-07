import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { exportToExcel } from "@/utils/excel-export"

interface Lead {
  id: string
  name: string
  dateInquired: string
  emailsSent: number
}

interface LeadTableProps {
  leads: Lead[]
  title: string
}

export function LeadTable({ leads, title }: LeadTableProps) {
  const handleExport = () => {
    exportToExcel(leads, `${title.toLowerCase().replace(/\s+/g, '-')}-leads`)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button onClick={handleExport}>Export to Excel</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date Inquired</TableHead>
            <TableHead>Emails Sent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.dateInquired}</TableCell>
              <TableCell>{lead.emailsSent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

