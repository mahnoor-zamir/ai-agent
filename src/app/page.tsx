"use client"
import { Metadata } from "next"
import { BarChart, Users, Calendar, ArrowUpRight, ArrowDownRight, Mail, Sparkles, Clock, MessageSquare, MailQuestion, UserCheck, Percent, CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LeadsTableDialog } from "@/components/leads-table-dialog"
import { useState } from 'react'
import { UpcomingFollowupsDialog } from "@/components/upcoming-followups-dialog"
import { format, addDays, subDays } from 'date-fns'
import { MetricDetailsSlider } from "@/components/metric-details-slider"
import { AISummarySlider } from "@/components/ai-summary-slider"
import "../styles/animations.css"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from "@/components/date-range-picker"
import { cn } from "@/lib/utils"
import {
  EmptyMetricCard,
  EmptyEngagementMetrics,
  EmptyConversionMetrics,
  EmptyRecentLeads,
  EmptyUpcomingFollowups
} from "@/components/empty-states"



type DateRange = {
  from: Date;
  to: Date;
};

// Dummy data for demonstration
const metrics = [
  {
    title: "Total Emails Sent Today",
    value: (dateRange: DateRange) => {
      // Calculate value based on dateRange
      return "156"
    },
    change: (dateRange: DateRange) => {
      // Calculate change based on dateRange
      return "+23%"
    },
    trend: (dateRange: DateRange) => {
      // Calculate trend based on dateRange
      return "up"
    },
    icon: Mail,
    iconColor: "text-blue-500",
    data: [
      { name: "John Doe", dateInquired: "2023-05-10T10:30:00Z", emailsSent: 3 },
      { name: "Jane Smith", dateInquired: "2023-05-10T11:15:00Z", emailsSent: 2 },
      { name: "Alice Johnson", dateInquired: "2023-05-11T09:00:00Z", emailsSent: 5 },
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "dateInquired", label: "Date Inquired" },
      { key: "emailsSent", label: "Emails Sent" },
    ],
  },
  {
    title: "Leads Handled by AI",
    value: (dateRange: DateRange) => {
      // Calculate value based on dateRange
      return "85%"
    },
    change: (dateRange: DateRange) => {
      // Calculate change based on dateRange
      return "+7%"
    },
    trend: (dateRange: DateRange) => {
      // Calculate trend based on dateRange
      return "up"
    },
    icon: Percent,
    iconColor: "text-indigo-500",
    data: [
      { name: "John Doe", dateInquired: "2023-05-10T10:30:00Z", leadsHandled: 5 },
      { name: "Jane Smith", dateInquired: "2023-05-10T11:15:00Z", leadsHandled: 3 },
      { name: "Alice Johnson", dateInquired: "2023-05-11T09:00:00Z", leadsHandled: 7 },
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "dateInquired", label: "Date Inquired" },
      { key: "leadsHandled", label: "Leads Handled" },
    ],
  },
  {
    title: "Tours Booked Today",
    value: (dateRange: DateRange) => {
      // Calculate value based on dateRange
      return "8"
    },
    change: (dateRange: DateRange) => {
      // Calculate change based on dateRange
      return "+14%"
    },
    trend: (dateRange: DateRange) => {
      // Calculate trend based on dateRange
      return "up"
    },
    icon: Calendar,
    iconColor: "text-green-500",
    data: [
      { name: "John Doe", dateInquired: "2023-05-10T10:30:00Z", emailsSent: 3 },
      { name: "Jane Smith", dateInquired: "2023-05-10T11:15:00Z", emailsSent: 2 },
      { name: "Alice Johnson", dateInquired: "2023-05-11T09:00:00Z", emailsSent: 5 },
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "dateInquired", label: "Date Inquired" },
      { key: "emailsSent", label: "Emails Sent" },
    ],
  },
]

const engagementMetrics = [
  { 
    title: "Avg. Response Time", 
    value: (dateRange: DateRange) => {
      // Calculate value based on dateRange
      return "2.5 hrs"
    }, 
    icon: Clock 
  },
  { 
    title: "Avg. Emails per Lead", 
    value: (dateRange: DateRange) => {
      // Calculate value based on dateRange
      return "4.2"
    }, 
    icon: MessageSquare 
  },
  { 
    title: "Avg. Emails Before Booking Tour", 
    value: (dateRange: DateRange) => {
      // Calculate value based on dateRange
      return "6.8"
    }, 
    icon: MailQuestion 
  },
  { 
    title: "Lead Replies", 
    value: (dateRange: DateRange) => {
      // Calculate value based on dateRange
      return "78"
    }, 
    icon: Users 
  },
]

const conversionMetrics = [
  { 
    title: "Leads Converted", 
    value: (dateRange: DateRange) => {
      // Calculate value based on dateRange
      return "12"
    }, 
    icon: UserCheck 
  },
  { 
    title: "Inquiry to Engagement Rate", 
    value: (dateRange: DateRange) => {
      // Calculate value based on dateRange
      return "68%"
    }, 
    icon: Percent 
  },
  { 
    title: "Conversation to Tour Rate", 
    value: (dateRange: DateRange) => {
      // Calculate value based on dateRange
      return "45%"
    }, 
    icon: Percent 
  },
  { 
    title: "Tour to Booking Ratio", 
    value: (dateRange: DateRange) => {
      // Calculate value based on dateRange
      return "0.75"
    }, 
    icon: Percent 
  },
]

const recentLeads = [
  { name: "Alice Johnson", email: "alice@example.com", status: "Inquiry Received", timestamp: "2023-05-10T14:30:00Z", source: "Website Form", responseTime: "Quick", engagementLevel: "High", timeline: "Clear", emotionalConnection: "Strong" },
  { name: "Bob Smith", email: "bob@example.com", status: "Tour Scheduled", timestamp: "2023-05-10T15:45:00Z", source: "WeddingWire", responseTime: "Moderate", engagementLevel: "Moderate", timeline: "Flexible", emotionalConnection: "Moderate" },
  { name: "Carol White", email: "carol@example.com", status: "Follow-up Sent", timestamp: "2023-05-10T16:20:00Z", source: "Social Media", responseTime: "Poor", engagementLevel: "Low", timeline: "No Timeline", emotionalConnection: "Minimal" },
  { name: "David Brown", email: "david@example.com", status: "AI Did Not Reply", timestamp: "2023-05-10T17:10:00Z", source: "Organic Search", responseTime: "Quick", engagementLevel: "High", timeline: "Clear", emotionalConnection: "Strong" },
  { name: "Eva Green", email: "eva@example.com", status: "Tour Scheduled", timestamp: "2023-05-11T09:00:00Z", source: "The Knot", responseTime: "Quick", engagementLevel: "High", timeline: "Clear", emotionalConnection: "Strong" },
];

const upcomingFollowUps = [
  { name: "Eva Green", email: "eva@example.com", scheduledFor: "2023-05-11T09:00:00Z", type: "First Follow-up", source: "Website Form", responseTime: "Quick", engagementLevel: "High", timeline: "Clear", emotionalConnection: "Strong" },
  { name: "Frank Lee", email: "frank@example.com", scheduledFor: "2023-05-11T10:30:00Z", type: "Second Follow-up", source: "WeddingWire", responseTime: "Moderate", engagementLevel: "Moderate", timeline: "Flexible", emotionalConnection: "Moderate" },
  { name: "Grace Chen", email: "grace@example.com", scheduledFor: "2023-05-11T13:15:00Z", type: "Third Follow-up", source: "Social Media", responseTime: "Poor", engagementLevel: "Low", timeline: "No Timeline", emotionalConnection: "Minimal" },
  { name: "Henry Wilson", email: "henry@example.com", scheduledFor: "2023-05-11T15:00:00Z", type: "Fourth Follow-up", source: "Organic Search", responseTime: "Quick", engagementLevel: "High", timeline: "Clear", emotionalConnection: "Strong" },
  { name: "Ivy Taylor", email: "ivy@example.com", scheduledFor: "2023-05-12T11:20:00Z", type: "First Follow-up", source: "The Knot", responseTime: "Quick", engagementLevel: "High", timeline: "Clear", emotionalConnection: "Strong" },
]

function calculateLeadScore(lead) {
  let score = 0;

  // 1. Inquiry Source (20%)
  if (["Website Form", "WeddingWire", "The Knot"].includes(lead.source)) {
    score += 20;
  } else if (["Organic Search", "Social Media"].includes(lead.source)) {
    score += 10;
  } else {
    score += 5;
  }

  // 2. Response Time (25%)
  if (lead.responseTime === "Quick") {
    score += 25;
  } else if (lead.responseTime === "Moderate") {
    score += 15;
  } else {
    score += 5;
  }

  // 3. Engagement Level (20%)
  if (lead.engagementLevel === "High") {
    score += 20;
  } else if (lead.engagementLevel === "Moderate") {
    score += 10;
  } else {
    score += 5;
  }

  // 4. Decision Timeline (15%)
  if (lead.timeline === "Clear") {
    score += 15;
  } else if (lead.timeline === "Flexible") {
    score += 10;
  } else {
    score += 5;
  }

  // 5. Emotional Connection (20%)
  if (lead.emotionalConnection === "Strong") {
    score += 20;
  } else if (lead.emotionalConnection === "Moderate") {
    score += 10;
  } else {
    score += 5;
  }

  return score;
}

export default function HomePage() {
  const [isLeadsDialogOpen, setIsLeadsDialogOpen] = useState(false)
  const [isFollowUpsDialogOpen, setIsFollowUpsDialogOpen] = useState(false)
  const [openSlider, setOpenSlider] = useState<string | null>(null)
  const [isAISummaryOpen, setIsAISummaryOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<{ name: string; summary: string } | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: new Date(), to: new Date() })
  const [showDateRangePicker, setShowDateRangePicker] = useState(false)
  const [currentRecentLeadsPage, setCurrentRecentLeadsPage] = useState(1)
  const [currentUpcomingFollowUpsPage, setCurrentUpcomingFollowUpsPage] = useState(1)
  const itemsPerPage = 5

  const handleAISummaryClick = (leadName: string) => {
    const dummySummary = `
      AI-generated summary for ${leadName}:
      
      - Initial Inquiry: Received on ${format(new Date(), "MMMM d, yyyy")}
      - Topics Discussed: Property features, pricing, availability
      - Key Questions: Asked about parking facilities and pet policies
      - AI Responses: Provided detailed information on 3 suitable properties
      - Follow-ups: 2 automated follow-up emails sent
      - Current Status: Scheduled for a virtual tour on ${format(addDays(new Date(), 3), "MMMM d, yyyy")}
      
      Action Items:
      1. Prepare virtual tour materials
      2. Send confirmation email with tour link
      3. Follow up after the tour for feedback
      
      Overall, ${leadName} shows high interest and is a promising lead.
    `
    setSelectedLead({ name: leadName, summary: dummySummary })
    setIsAISummaryOpen(true)
  }

  const handleDateRangeChange = (value: string) => {
    setShowDateRangePicker(false)
    const today = new Date()
    let from: Date
    let to: Date = today

    switch (value) {
      case 'today':
        from = today
        break
      case 'this-week':
        from = subDays(today, 7)
        break
      case 'last-week':
        from = subDays(today, 14)
        to = subDays(today, 7)
        break
      case 'last-month':
        from = subDays(today, 30)
        break
      case 'last-quarter':
        from = subDays(today, 90)
        break
      case 'last-year':
        from = subDays(today, 365)
        break
      case 'month-to-date':
        from = new Date(today.getFullYear(), today.getMonth(), 1)
        break
      case 'year-to-date':
        from = new Date(today.getFullYear(), 0, 1)
        break
      case 'custom':
        setShowDateRangePicker(true)
        return
      default:
        from = today
    }

    setDateRange({ from, to })
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, John Doe</h1>
            <p className="text-lg text-muted-foreground">Here's an overview of activities for your AI Agent</p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-lg font-semibold">
              {format(new Date(), "MMMM d, yyyy")}
            </p>
            <div className="flex items-center space-x-2">
              <Select onValueChange={handleDateRangeChange} defaultValue="today">
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
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              {showDateRangePicker && (
                <DateRangePicker
                  date={dateRange}
                  onDateChange={(newDateRange) => {
                    setDateRange(newDateRange)
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <Card 
              key={metric.title} 
              className="transition-all hover:shadow-md cursor-pointer" 
              onClick={() => setOpenSlider(metric.title)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value(dateRange)}</div>
                <p className={`text-xs ${metric.trend(dateRange) === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {metric.change(dateRange)}
                  {metric.trend(dateRange) === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 inline ml-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 inline ml-1" />
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
          {/* Uncomment the following lines to show empty states */}
          {/* {metrics.map((metric) => (
            <EmptyMetricCard key={metric.title} title={metric.title} icon={metric.icon} />
          ))} */}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engagementMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <metric.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{metric.title}</span>
                    </div>
                    <span className="text-lg font-bold">{metric.value(dateRange)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Uncomment the following line to show empty state */}
          {/* <EmptyEngagementMetrics /> */}

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
                    <span className="text-lg font-bold">{metric.value(dateRange)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Uncomment the following line to show empty state */}
          {/* <EmptyConversionMetrics /> */}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Leads Handled by AI</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsLeadsDialogOpen(true)}>View All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Lead Score</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.slice((currentRecentLeadsPage - 1) * itemsPerPage, currentRecentLeadsPage * itemsPerPage).map((lead) => (
                  <TableRow key={lead.email}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          lead.status === 'Tour Scheduled' ? 'default' :
                          lead.status === 'AI Did Not Reply' ? 'destructive' :
                          lead.status === 'Follow-up Sent' ? 'secondary' :
                          lead.status === 'Inquiry Received' ? 'info' :
                          'secondary'
                        }
                        className={
                          lead.status === 'Tour Scheduled' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                          : lead.status === 'AI Did Not Reply'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                          : lead.status === 'Follow-up Sent'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
                          : lead.status === 'Inquiry Received'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                          : ''
                        }
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(lead.timestamp), 'MMMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        calculateLeadScore(lead) >= 80 ? 'bg-green-100 text-green-800' :
                        calculateLeadScore(lead) >= 60 ? 'bg-blue-100 text-blue-800' :
                        calculateLeadScore(lead) >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {calculateLeadScore(lead)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAISummaryClick(lead.name)}
                            className="group"
                          >
                            <Sparkles className="h-4 w-4 text-[#0042af] group-hover:animate-pulse-scale" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>AI Summary</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentRecentLeadsPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentRecentLeadsPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm leading-8">
                Page {currentRecentLeadsPage} of {Math.ceil(recentLeads.length / itemsPerPage)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentRecentLeadsPage((prev) => Math.min(prev + 1, Math.ceil(recentLeads.length / itemsPerPage)))}
                disabled={currentRecentLeadsPage === Math.ceil(recentLeads.length / itemsPerPage)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Uncomment the following line to show empty state */}
        {/* <EmptyRecentLeads /> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Follow-ups</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsFollowUpsDialogOpen(true)}>View All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Lead Score</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingFollowUps.slice((currentUpcomingFollowUpsPage - 1) * itemsPerPage, currentUpcomingFollowUpsPage * itemsPerPage).map((followUp) => (
                  <TableRow key={followUp.email}>
                    <TableCell className="font-medium">{followUp.name}</TableCell>
                    <TableCell>{followUp.email}</TableCell>
                    <TableCell>
                      {format(new Date(followUp.scheduledFor), 'MMMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          followUp.type === 'First Follow-up' ? 'default' :
                          followUp.type === 'Second Follow-up' ? 'secondary' :
                          followUp.type === 'Third Follow-up' ? 'outline' :
                          'destructive'
                        }
                        className={
                          followUp.type === 'First Follow-up'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : followUp.type === 'Second Follow-up'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                          : followUp.type === 'Third Follow-up'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        }
                      >
                        {followUp.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        calculateLeadScore(followUp) >= 80 ? 'bg-green-100 text-green-800' :
                        calculateLeadScore(followUp) >= 60 ? 'bg-blue-100 text-blue-800' :
                        calculateLeadScore(followUp) >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {calculateLeadScore(followUp)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAISummaryClick(followUp.name)}
                            className="group"
                          >
                            <Sparkles className="h-4 w-4 text-[#0042af] group-hover:animate-pulse-scale" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>AI Summary</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentUpcomingFollowUpsPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentUpcomingFollowUpsPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm leading-8">
                Page {currentUpcomingFollowUpsPage} of {Math.ceil(upcomingFollowUps.length / itemsPerPage)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentUpcomingFollowUpsPage((prev) => Math.min(prev + 1, Math.ceil(upcomingFollowUps.length / itemsPerPage)))}
                disabled={currentUpcomingFollowUpsPage === Math.ceil(upcomingFollowUps.length / itemsPerPage)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Uncomment the following line to show empty state */}
        {/* <EmptyUpcomingFollowups /> */}
        {metrics.map((metric) => (
          <MetricDetailsSlider
            key={metric.title}
            isOpen={openSlider === metric.title}
            onClose={() => setOpenSlider(null)}
            title={metric.title}
            description={`Detailed information about ${metric.title.toLowerCase()}`}
            data={metric.data}
            columns={metric.columns}
          />
        ))}
        <LeadsTableDialog
          isOpen={isLeadsDialogOpen}
          onClose={() => setIsLeadsDialogOpen(false)}
          leads={recentLeads}
        />
        <UpcomingFollowupsDialog
          isOpen={isFollowUpsDialogOpen}
          onClose={() => setIsFollowUpsDialogOpen(false)}
          followUps={upcomingFollowUps}
        />
        <AISummarySlider
          isOpen={isAISummaryOpen}
          onClose={() => setIsAISummaryOpen(false)}
          leadName={selectedLead?.name || ''}
          summary={selectedLead?.summary || ''}
        />
      </div>
    </TooltipProvider>
  )
}

