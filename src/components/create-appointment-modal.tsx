import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface CreateAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateAppointment: (appointmentDetails: AppointmentDetails) => void
}

interface AppointmentDetails {
  title: string
  date: Date | undefined
  startTime: string
  endTime: string
  location: string
  email: string
  notes: string
}

export function CreateAppointmentModal({
  isOpen,
  onClose,
  onCreateAppointment,
}: CreateAppointmentModalProps) {
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    title: '',
    date: undefined,
    startTime: '',
    endTime: '',
    location: '',
    email: '',
    notes: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAppointmentDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    setAppointmentDetails((prev) => ({ ...prev, date }))
  }

  const handleCreateAppointment = () => {
    onCreateAppointment(appointmentDetails)
    setAppointmentDetails({
      title: '',
      date: undefined,
      startTime: '',
      endTime: '',
      location: '',
      email: '',
      notes: '',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 bg-white border-b">
          <DialogTitle className="text-2xl font-semibold">Create Appointment</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details for your new appointment.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={appointmentDetails.title}
              onChange={handleInputChange}
              placeholder="Enter appointment title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !appointmentDetails.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {appointmentDetails.date ? format(appointmentDetails.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={appointmentDetails.date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <div>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={appointmentDetails.startTime}
                    onChange={handleInputChange}
                    className=""
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <div>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={appointmentDetails.endTime}
                    onChange={handleInputChange}
                    className=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={appointmentDetails.location}
              onChange={handleInputChange}
              placeholder="Enter appointment location"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={appointmentDetails.email}
              onChange={handleInputChange}
              placeholder="Enter attendee email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={appointmentDetails.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter className="px-6 py-4 bg-muted">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreateAppointment}>Create Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
