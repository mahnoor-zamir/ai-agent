import { useState } from 'react'
import { format } from 'date-fns'
import { Search, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

interface MetricDetailsSliderProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  data: any[]
  columns: { key: string; label: string }[]
}
//MetricDetailsSlider
export function MetricDetailsSlider({ isOpen, onClose, title, description, data, columns }: MetricDetailsSliderProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = data.filter(item =>
    Object.values(item).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-[800px] overflow-y-auto">
        <SheetHeader className="flex flex-col items-start pr-10">
          <SheetTitle className="text-left">{title}</SheetTitle>
          <SheetDescription className="text-left">{description}</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  {columns.map((column) => (
                    <TableHead key={column.key}>{column.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.key === 'dateInquired' 
                          ? format(new Date(item[column.key]), 'MMM d, yyyy HH:mm')
                          : item[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </SheetContent>
    </Sheet>
  )
}

