"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConversationsTable } from "@/components/conversations-table"
import { Knowledgebase } from "@/components/knowledgebase"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function EmailAnalytics() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 mx-auto max-w-7xl w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Sales Agent Dashboard</h1>
        <p className="text-lg text-muted-foreground">Track your AI agent's performance and follow-up metrics</p>
      </div>
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="knowledgebase">Knowledgebase</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
        <TabsContent value="conversations">
          <ConversationsTable />
        </TabsContent>
        <TabsContent value="knowledgebase">
          <Knowledgebase />
        </TabsContent>
      </Tabs>
    </div>
  )
}

