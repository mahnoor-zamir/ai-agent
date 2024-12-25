
"use client";

import { useState, useEffect } from 'react';
import { format, startOfWeek, parseISO, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, endOfWeek, getWeek, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Search, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateAppointmentModal } from "./create-appointment-modal";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  interface Event {
    id: string;
    summary: string;
    start: {
      dateTime: string;
    };
    end: {
      dateTime: string;
    };
  }
  
  const [events, setEvents] = useState<Event[]>([]);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate years array (100 years before and after current year)
  const years = Array.from({ length: 201 }, (_, i) => 
    currentDate.getFullYear() - 100 + i
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/calendar/fetch-events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  interface AppointmentDetails {
    summary: string;
    start: {
      dateTime: string;
    };
    end: {
      dateTime: string;
    };
  }

  const handleCreateAppointment = async (appointmentDetails: any) => {
    try {
      const response = await fetch('/api/calendar/add-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to add event');
      }

      const newEvent = await response.json();
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setIsCreateAppointmentOpen(false);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleDateChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    const newDate = new Date(year, month);
    setCurrentDate(newDate);
  };

  const handlePrevMonth = () => {
    const newDate = subMonths(new Date(selectedYear, selectedMonth), 1);
    handleDateChange(newDate.getMonth(), newDate.getFullYear());
  };

  const handleNextMonth = () => {
    const newDate = addMonths(new Date(selectedYear, selectedMonth), 1);
    handleDateChange(newDate.getMonth(), newDate.getFullYear());
  };

  const renderMonthSelector = () => (
    <div className="grid grid-cols-3 gap-2">
      {months.map((month, index) => (
        <Button
          key={month}
          variant={selectedMonth === index ? "default" : "outline"}
          className="w-full text-sm"
          onClick={() => handleDateChange(index, selectedYear)}
        >
          {month.slice(0, 3)}
        </Button>
      ))}
    </div>
  );

  const renderYearSelector = () => (
    <ScrollArea className="h-[200px]">
      <div className="space-y-1">
        {years.map((year) => (
          <Button
            key={year}
            variant={selectedYear === year ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleDateChange(selectedMonth, year)}
          >
            {year}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );

  const renderMonthView = () => {
    const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weeks = Math.ceil(days.length / 7);

    return (
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-7 border-b bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-4 text-sm font-medium text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-rows-[repeat(6,1fr)]">
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
              {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const dayEvents = events.filter(event => event.start.dateTime.startsWith(dayStr));
                const isCurrentMonth = isSameMonth(day, new Date(selectedYear, selectedMonth));
                const isToday = dayStr === format(new Date(), 'yyyy-MM-dd');
                const showMore = dayEvents.length > 2;

                return (
                  <div
                    key={dayIndex}
                    className={`min-h-[120px] p-2 border-r last:border-r-0 transition-colors
                      ${isCurrentMonth ? 'bg-white' : 'bg-gray-50/50'}
                      ${isToday ? 'bg-purple-50' : ''}
                      hover:bg-gray-50`}
                  >
                    <div className={`text-sm mb-1 font-medium
                      ${isToday ? 'text-purple-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="bg-blue-100 rounded-md p-1.5 text-xs hover:bg-blue-200 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{event.summary}</span>
                          </div>
                          <div className="text-gray-600 text-[10px] mt-0.5">
                            {format(parseISO(event.start.dateTime), 'p')}
                          </div>
                        </div>
                      ))}
                      {showMore && (
                        <div className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center bg-gray-100 rounded-lg p-2 min-w-[60px]">
              <span className="text-sm font-medium text-gray-500">
                {format(new Date(selectedYear, selectedMonth), 'MMM').toUpperCase()}
              </span>
              <span className="text-2xl font-bold text-purple-600">
                {format(new Date(selectedYear, selectedMonth), 'd')}
              </span>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="text-lg font-semibold">
                    {format(new Date(selectedYear, selectedMonth), 'MMMM yyyy')}
                    <span className="ml-2 text-sm text-gray-500 font-normal">
                      Week {getWeek(new Date(selectedYear, selectedMonth))}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Month</h4>
                      {renderMonthSelector()}
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Year</h4>
                      {renderYearSelector()}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <p className="text-sm text-gray-500 mt-1">
                {format(startOfMonth(new Date(selectedYear, selectedMonth)), 'MMM d')} - {format(endOfMonth(new Date(selectedYear, selectedMonth)), 'MMM d, yyyy')}
              </p>
            </div>
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
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => {
              const today = new Date();
              handleDateChange(today.getMonth(), today.getFullYear());
            }}>Today</Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
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
            ? <div className="p-4">Week View (Coming soon)</div>
            : <div className="p-4">Day View (Coming soon)</div>
          }
        </ScrollArea>
      </Card>
      <CreateAppointmentModal
        isOpen={isCreateAppointmentOpen}
        onClose={() => setIsCreateAppointmentOpen(false)}
        onCreateAppointment={handleCreateAppointment}
      />
    </div>
  );
}