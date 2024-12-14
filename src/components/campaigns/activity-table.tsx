"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

interface Activity {
  id: string
  name: string
  campaign: string
  timestamp: string
  status: "sent" | "queued" | "failed" | "draft"
  messageType: "email" | "sms"
}

const activities: Activity[] = [
  {
    id: "1",
    name: "John Doe",
    campaign: "Post-Tour Message",
    timestamp: "2024-01-10T10:00:00Z",
    status: "sent",
    messageType: "email"
  },
  {
    id: "2",
    name: "Jane Smith",
    campaign: "Review Request",
    timestamp: "2024-01-10T10:30:00Z",
    status: "queued",
    messageType: "sms"
  },
  {
    id: "3",
    name: "Alice Johnson",
    campaign: "Follow-up",
    timestamp: "2024-01-10T11:00:00Z",
    status: "failed",
    messageType: "email"
  },
  {
    id: "4",
    name: "Bob Williams",
    campaign: "Welcome Series",
    timestamp: "2024-01-10T11:30:00Z",
    status: "draft",
    messageType: "email"
  },
]

export function ActivityTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.campaign.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Message Type</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.name}</TableCell>
                <TableCell>{activity.campaign}</TableCell>
                <TableCell className="capitalize">{activity.messageType}</TableCell>
                <TableCell>{format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      activity.status === 'sent' ? 'default' :
                      activity.status === 'queued' ? 'secondary' :
                      activity.status === 'failed' ? 'destructive' :
                      'outline'
                    }
                    className={
                      activity.status === 'sent' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                      : activity.status === 'queued'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                      : activity.status === 'failed'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }
                  >
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

