import { BarChart, Calendar, Mail, MessageSquare, Percent, Users } from 'lucide-react'
import { EmptyState } from "@/components/ui/empty-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EmptyMetricCard({ title, icon: Icon }: { title: string; icon: typeof Mail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={Icon}
          title="No data yet"
          description="Start using the platform to see metrics here."
        />
      </CardContent>
    </Card>
  )
}

export function EmptyEngagementMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={MessageSquare}
          title="No engagement data"
          description="Engagement metrics will appear here once you start interacting with leads."
        />
      </CardContent>
    </Card>
  )
}

export function EmptyConversionMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={Percent}
          title="No conversion data"
          description="Conversion metrics will be displayed here as you convert leads."
        />
      </CardContent>
    </Card>
  )
}

export function EmptyRecentLeads() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Leads Handled by AI</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={Users}
          title="No recent leads"
          description="Recent leads handled by AI will appear here."
        />
      </CardContent>
    </Card>
  )
}

export function EmptyUpcomingFollowups() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Follow-ups</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={Calendar}
          title="No upcoming follow-ups"
          description="Scheduled follow-ups will be listed here."
        />
      </CardContent>
    </Card>
  )
}

