import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  interface LeadData {
    id: string
    firstName: string
    lastName: string
    email: string
    dateOfInquiry: string
  }
  
  interface LeadDataTableProps {
    data: LeadData[]
  }
  
  export function LeadDataTable({ data }: LeadDataTableProps) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date of Inquiry</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>{lead.firstName}</TableCell>
              <TableCell>{lead.lastName}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.dateOfInquiry}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  