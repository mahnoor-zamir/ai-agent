import { CalendarView } from "@/components/calendar-view"
import ErrorBoundary from "@/components/error-boundary"

export default function CalendarPage() {
  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-lg text-muted-foreground">View and manage booked tours</p>
      </div>
      <ErrorBoundary fallback={<div>Something went wrong in the Calendar View.</div>}>
        <CalendarView />
      </ErrorBoundary>
    </div>
  )
}

