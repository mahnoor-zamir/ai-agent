"use client"
import { useState, useEffect } from 'react'
import { Mail, MailCheck, Users, Clock, Calendar, UserCheck, MessageSquare, Timer, MailQuestion, Percent, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, BarChart, Tooltip, Legend, ComposedChart } from "recharts"
import { format, subDays, subWeeks, subMonths, subYears, startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear } from 'date-fns'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LeadTable } from "@/components/lead-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"

const chartColors = {
  toursBooked: "hsl(var(--primary))",
  inquiries: "hsl(var(--secondary))",
  conversions: "hsl(var(--accent))",
  engagementCount: "hsl(var(--muted))",
  engagementRate: "hsl(var(--destructive))",
}

// Function to generate dummy data
function generateDummyData(startDate: Date, endDate: Date) {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const emailsSentByAI = Math.floor(Math.random() * 40) + 10
    const engagementCount = Math.floor(Math.random() * 30) + 5
    const totalEmails = Math.floor(Math.random() * 50) + emailsSentByAI
    return {
      date: date.toISOString().split('T')[0],
      emails: totalEmails,
      emailsSentByAI: emailsSentByAI,
      followups: Math.floor(Math.random() * 20) + 10,
      leadReplies: Math.floor(Math.random() * 15) + 5,
      speedToReply: Math.random() * 2 + 1,
      toursBooked: Math.floor(Math.random() * 5) + 1,
      leadsConverted: Math.floor(Math.random() * 3) + 1,
      avgEmails: Math.random() * 2 + 3,
      avgResponseTime: Math.random() * 3 + 2,
      emailsToLeads: Math.floor(Math.random() * 30) + 20,
      emailsBeforeBooking: Math.floor(Math.random() * 3) + 4,
      conversionRate: Math.random() * 0.1 + 0.05,
      nonRespondingLeads: Math.floor(Math.random() * 10) + 5,
      inquiries: Math.floor(Math.random() * 20) + 10,
      engagements: engagementCount,
      engagementRate: (engagementCount / totalEmails * 100).toFixed(2),
      conversations: Math.floor(Math.random() * 10) + 3,
      bookings: Math.floor(Math.random() * 3) + 1,
      leadsHandledByAI: Math.floor(Math.random() * 10) + 5,
    }
  })
}

// Function to generate dummy lead data
function generateDummyLeads(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    return {
      id: `lead-${i + 1}`,
      name: `Lead ${i + 1}`,
      dateInquired: date.toISOString().split('T')[0],
      emailsSent: Math.floor(Math.random() * 10) + 1,
    }
  })
}

type DateRange = {
  from: Date
  to: Date
}

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({ from: subDays(new Date(), 30), to: new Date() })
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined)
  const [data, setData] = useState<ReturnType<typeof generateDummyData>>([])
  const leads = generateDummyLeads(50)  // Generate 50 dummy leads

  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  useEffect(() => {
    setData(generateDummyData(dateRange.from, dateRange.to))
  }, [dateRange])

  const totalEmails = data.reduce((sum, day) => sum + day.emails, 0)
  const totalEmailsSentByAI = data.reduce((sum, day) => sum + day.emailsSentByAI, 0)
  const totalFollowups = data.reduce((sum, day) => sum + day.followups, 0)
  const totalLeadReplies = data.reduce((sum, day) => sum + day.leadReplies, 0)
  const totalToursBooked = data.reduce((sum, day) => sum + day.toursBooked, 0)
  const totalLeadsConverted = data.reduce((sum, day) => sum + day.leadsConverted, 0)
  const avgSpeedToReply = data.reduce((sum, day) => sum + day.speedToReply, 0) / data.length
  const avgEmails = data.reduce((sum, day) => sum + day.avgEmails, 0) / data.length
  const avgResponseTime = data.reduce((sum, day) => sum + day.avgResponseTime, 0) / data.length
  const totalEmailsToLeads = data.reduce((sum, day) => sum + day.emailsToLeads, 0)
  const avgEmailsBeforeBooking = data.reduce((sum, day) => sum + day.emailsBeforeBooking, 0) / data.length

  const totalInquiries = data.reduce((sum, day) => sum + day.inquiries, 0)
  const totalEngagements = data.reduce((sum, day) => sum + day.engagements, 0)
  const totalConversations = data.reduce((sum, day) => sum + day.conversations, 0)
  const totalBookings = data.reduce((sum, day) => sum + day.bookings, 0)

  const totalLeads = data.reduce((sum, day) => sum + day.inquiries, 0)
  const totalLeadsHandledByAI = data.reduce((sum, day) => sum + day.leadsHandledByAI, 0)

  const inquiryToEngagementRate = totalInquiries > 0 ? totalEngagements / totalInquiries : 0
  const conversationToTourRate = totalConversations > 0 ? totalToursBooked / totalConversations : 0
  const tourToBookingRatio = totalToursBooked > 0 ? totalBookings / totalToursBooked : 0

  const calculateChange = (metric: keyof typeof data[0]) => {
    if (data.length < 2) return '0.0'
    const lastWeek = data.slice(-7)
    const previousWeek = data.slice(-14, -7)
    const lastWeekTotal = lastWeek.reduce((sum, day) => sum + day[metric], 0)
    const previousWeekTotal = previousWeek.reduce((sum, day) => sum + day[metric], 0)
    const change = ((lastWeekTotal - previousWeekTotal) / previousWeekTotal) * 100
    return change.toFixed(1)
  }

  const keyMetrics = [
    { title: "Total Emails Sent", value: totalEmails, icon: Mail, change: calculateChange('emails'), trend: calculateChange('emails') > 0 ? "up" : "down" },
    { title: "Tours Booked", value: totalToursBooked, icon: Calendar, change: calculateChange('toursBooked'), trend: calculateChange('toursBooked') > 0 ? "up" : "down" },
    { title: "Leads Handled by AI", value: `${(totalLeadsHandledByAI / totalLeads * 100).toFixed(1)}%`, icon: Percent, change: calculateChange('leadsHandledByAI'), trend: calculateChange('leadsHandledByAI') > 0 ? "up" : "down" },
  ]

  const engagementMetrics = [
    { title: "Avg. Response Time", value: `${avgResponseTime.toFixed(1)} hrs`, icon: Clock },
    { title: "Avg. Emails per Lead", value: avgEmails.toFixed(1), icon: MessageSquare },
    { title: "Avg. Emails Before Booking Tour", value: avgEmailsBeforeBooking.toFixed(1), icon: MailQuestion },
    { title: "Lead Replies", value: totalLeadReplies, icon: Users },
  ]

  const conversionMetrics = [
    { title: "Leads Converted", value: totalLeadsConverted, icon: UserCheck },
    { title: "Inquiry to Engagement Rate", value: `${(inquiryToEngagementRate * 100).toFixed(1)}% (${totalEngagements}/${totalInquiries})`, icon: Percent },
    { title: "Conversation to Tour Rate", value: `${(conversationToTourRate * 100).toFixed(1)}% (${totalToursBooked}/${totalConversations})`, icon: Percent },
    { title: "Tour to Booking Ratio", value: tourToBookingRatio.toFixed(2), icon: Percent },
  ]

  const handleDateRangeChange = (value: string) => {
    const today = new Date()
    let from: Date
    let to: Date = today

    switch (value) {
      case 'today':
        from = today
        break
      case 'this-week':
        from = startOfWeek(today)
        to = endOfWeek(today)
        break
      case 'last-week':
        from = startOfWeek(subWeeks(today, 1))
        to = endOfWeek(subWeeks(today, 1))
        break
      case 'last-month':
        from = startOfMonth(subMonths(today, 1))
        to = endOfMonth(subMonths(today, 1))
        break
      case 'last-quarter':
        from = subMonths(today, 3)
        break
      case 'last-year':
        from = subYears(today, 1)
        break
      case 'month-to-date':
        from = startOfMonth(today)
        break
      case 'year-to-date':
        from = startOfYear(today)
        break
      case 'this-year':
        from = startOfYear(today)
        to = endOfYear(today)
        break
      case 'custom':
        setCustomDateRange({ from: subDays(today, 7), to: today })
        return
      default:
        from = subDays(today, 30)
    }

    setDateRange({ from, to })
  }

  return (
    <div className="space-y-4">
      <Select onValueChange={handleDateRangeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="this-week">This Week</SelectItem>
          <SelectItem value="last-week">Last Week</SelectItem>
          <SelectItem value="last-month">Last Month</SelectItem>
          <SelectItem value="last-quarter">Last Quarter</SelectItem>
          <SelectItem value="last-year">Last Year</SelectItem>
          <SelectItem value="month-to-date">Month to Date</SelectItem>
          <SelectItem value="year-to-date">Year to Date</SelectItem>
          <SelectItem value="this-year">This Year</SelectItem>
          <SelectItem value="custom">Custom Date Range</SelectItem>
        </SelectContent>
      </Select>

      {customDateRange && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {format(customDateRange.from, "LLL dd, y")} - {format(customDateRange.to, "LLL dd, y")}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={customDateRange.from}
              selected={customDateRange}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setCustomDateRange(range)
                  setDateRange(range)
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {keyMetrics && keyMetrics.map((metric, index) => (
              <Sheet key={index}>
                <SheetTrigger asChild>
                  <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="flex flex-row items-center justify-between p-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                        <span className="text-2xl font-bold">{metric.value}</span>
                        <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}%
                          {metric.trend === 'up' ? <TrendingUp className="inline ml-1 w-4 h-4" /> : <TrendingDown className="inline ml-1 w-4 h-4" />}
                        </span>
                      </div>
                      <metric.icon className="w-8 h-8 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-full sm:max-w-full">
                  <SheetHeader>
                    <SheetTitle>{metric.title} Details</SheetTitle>
                    <SheetDescription>
                      Detailed information about {metric.title.toLowerCase()}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <LeadTable leads={leads} title={metric.title} />
                  </div>
                </SheetContent>
              </Sheet>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagementMetrics && engagementMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <metric.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{metric.title}</span>
                  </div>
                  <span className="text-lg font-bold">{metric.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <metric.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{metric.title}</span>
                  </div>
                  <span className="text-lg font-bold">{metric.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ai_emails" className="space-y-4">
            <TabsList>
              <TabsTrigger value="ai_emails">AI Emails</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="tours_booked">Tours Booked</TabsTrigger>
            </TabsList>
            <TabsContent value="ai_emails" className="space-y-4">
              <ChartContainer
                config={{
                  emailsSentByAI: {
                    label: "Emails Sent by AI",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="emailsSentByAI"
                      strokeWidth={2}
                      activeDot={{
                        r: 6,
                        style: { fill: "var(--chart-1)" },
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="engagement" className="space-y-4">
              <ChartContainer
                config={{
                  engagements: {
                    label: "Engagement Count",
                    color: chartColors.engagementCount,
                  },
                  engagementRate: {
                    label: "Engagement Rate (%)",
                    color: chartColors.engagementRate,
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data}>
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke={chartColors.engagementCount}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke={chartColors.engagementRate}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="engagements" fill={chartColors.engagementCount} name="Engagement Count" radius={[4, 4, 0, 0]} />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="engagementRate"
                      stroke={chartColors.engagementRate}
                      strokeWidth={2}
                      name="Engagement Rate (%)"
                      dot={{ fill: chartColors.engagementRate, strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="tours_booked" className="space-y-4">
              <ChartContainer
                config={{
                  toursBooked: {
                    label: "Tours Booked",
                    color: chartColors.toursBooked,
                  },
                  inquiries: {
                    label: "Inquiries",
                    color: chartColors.inquiries,
                  },
                  conversions: {
                    label: "Conversions",
                    color: chartColors.conversions,
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="toursBooked" fill={chartColors.toursBooked} name="Tours Booked" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="inquiries" fill={chartColors.inquiries} name="Inquiries" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="conversions" fill={chartColors.conversions} name="Conversions" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

