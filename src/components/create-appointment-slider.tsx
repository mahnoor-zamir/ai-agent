import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface CreateAppointmentSliderProps {
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
  description: string
  notes: string
  attendeeEmails: string
}

export function CreateAppointmentSlider({
  isOpen,
  onClose,
  onCreateAppointment,
}: CreateAppointmentSliderProps) {
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    title: '',
    date: undefined,
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    notes: '',
    attendeeEmails: '',
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
      description: '',
      notes: '',
      attendeeEmails: '',
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-[540px] overflow-y-auto">
        <div className="min-h-[calc(100vh-2rem)]">
          <SheetHeader className="space-y-2 pr-10">
            <SheetTitle>Create Appointment</SheetTitle>
            <SheetDescription>
              Fill in the details for your new appointment.
            </SheetDescription>
          </SheetHeader>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={appointmentDetails.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2 w-full">
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={appointmentDetails.date}
                onSelect={handleDateSelect}
                className="rounded-md border w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Date & Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={appointmentDetails.startTime}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Date & Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={appointmentDetails.endTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={appointmentDetails.location}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendeeEmails">Attendee Emails</Label>
              <Input
                id="attendeeEmails"
                name="attendeeEmails"
                value={appointmentDetails.attendeeEmails}
                onChange={handleInputChange}
                placeholder="Enter email addresses separated by commas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={appointmentDetails.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Add a description here..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={appointmentDetails.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Add any additional notes here..."
              />
            </div>
            <Button className="w-full" onClick={handleCreateAppointment}>
              Create Appointment
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

