"use client"

import { useState } from 'react'
import { format, startOfWeek, addDays, parseISO, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, endOfWeek } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Search, Circle, Copy, Trash2, PenLine, Calendar, Clock, Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreateAppointmentModal } from "./create-appointment-modal"

// Sample event data
const events = [
  {
    id: 1,
    title: "Monday standup",
    time: "9:00 AM",
    date: "2025-01-06",
    color: "bg-gray-100"
  },
  {
    id: 2,
    title: "Product demo",
    time: "10:30 AM",
    date: "2025-01-06",
    color: "bg-blue-100"
  },
  {
    id: 3,
    title: "One-on-one with Eva",
    time: "10:00 AM",
    date: "2025-01-07",
    color: "bg-pink-100"
  },
  {
    id: 4,
    title: "Deep work",
    time: "9:00 AM",
    date: "2025-01-08",
    color: "bg-blue-100"
  },
  {
    id: 5,
    title: "Lunch with Olivia",
    time: "12:00 PM",
    date: "2025-01-09",
    color: "bg-green-100",
    hasIndicator: true
  },
  {
    id: 6,
    title: "Friday standup",
    time: "9:00 AM",
    date: "2025-01-10",
    color: "bg-gray-100"
  },
  {
    id: 7,
    title: "House inspection",
    time: "11:00 AM",
    date: "2025-01-11",
    color: "bg-orange-100",
    hasIndicator: true
  },
  {
    id: 8,
    title: "Ava's engagement party",
    time: "1:00 PM",
    date: "2025-01-12",
    color: "bg-purple-100",
    hasIndicator: true
  }
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 10))
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [selectedEvent, setSelectedEvent] = useState(events[2])
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false)

  const renderWeekView = () => {
    return <div>Week View (Not implemented)</div>
  }

  const renderDayView = () => {
    return <div>Day View (Not implemented)</div>
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const weeks = Math.ceil(days.length / 7)

    return (
      <div className="flex flex-col h-full">
        {/* Month header */}
        <div className="grid grid-cols-7 border-b">
          {['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="p-4 text-sm text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 grid grid-rows-[repeat(6,1fr)]">
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
              {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                const dayStr = format(day, 'yyyy-MM-dd')
                const dayEvents = events.filter(event => event.date === dayStr)
                const isCurrentMonth = day.getMonth() === currentDate.getMonth()
                const isToday = dayStr === format(new Date(2025, 0, 10), 'yyyy-MM-dd')
                const showMore = dayEvents.length > 3

                return (
                  <div
                    key={dayIndex}
                    className={`min-h-[120px] p-2 border-r last:border-r-0 ${
                      isCurrentMonth ? '' : 'bg-gray-50'
                    } ${isToday ? 'bg-purple-50' : ''}`}
                  >
                    <div className={`text-sm mb-1 ${
                      isToday ? 'text-purple-600 font-semibold' : 'text-gray-600'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`${event.color} rounded-md p-1 text-xs`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{event.title}</span>
                            {event.hasIndicator && (
                              <Circle className="h-1.5 w-1.5 fill-current" />
                            )}
                          </div>
                          <div className="text-gray-600">{event.time}</div>
                        </div>
                      ))}
                      {showMore && (
                        <div className="text-xs text-gray-500">
                          {dayEvents.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">JAN</span>
            <span className="text-2xl font-bold text-purple-500">10</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              January 2025
              <span className="ml-2 text-sm text-gray-500 font-normal">Week 1</span>
            </h2>
            <p className="text-sm text-gray-500">
              Jan 1, 2025 - Jan 31, 2025
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search calendar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline">Today</Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select value={view} onValueChange={(v) => setView(v as 'month' | 'week' | 'day')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month view</SelectItem>
              <SelectItem value="week">Week view</SelectItem>
              <SelectItem value="day">Day view</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-black hover:bg-gray-800 text-white" onClick={() => setIsCreateAppointmentOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> + Add Appointment
          </Button>
        </div>
      </div>

      <Card className="flex-1">
        <ScrollArea className="h-full">
          {view === 'month' 
            ? renderMonthView()
            : view === 'week'
            ? renderWeekView()
            : renderDayView()
          }
        </ScrollArea>
      </Card>
      <CreateAppointmentModal
        isOpen={isCreateAppointmentOpen}
        onClose={() => setIsCreateAppointmentOpen(false)}
        onCreateAppointment={(appointmentDetails) => {
          console.log("New appointment:", appointmentDetails)
          setIsCreateAppointmentOpen(false)
          // TODO: Implement appointment creation logic
        }}
      />
    </div>
  )
}

