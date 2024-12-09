//ai-agent\src\app\page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConversationsTable } from "@/components/conversations-table"
import { Knowledgebase } from "@/components/knowledgebase"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import ErrorBoundary from "@/components/error-boundary"
import { AIAgentToggle } from "@/components/ai-agent-toggle"

export default async function EmailAnalytics() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 mx-auto max-w-7xl w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Sales Agent Dashboard</h1>
          <p className="text-lg text-muted-foreground">Track your AI agent's performance and follow-up metrics</p>
        </div>
        <AIAgentToggle />
      </div>
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 text-gray">
          <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold " value="analytics">Analytics</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold" value="conversations">Conversations</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold" value="knowledgebase">Knowledgebase</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics">
          <ErrorBoundary fallback={<div>Something went wrong in the Analytics Dashboard.</div>}>
            <AnalyticsDashboard />
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="conversations">
          <ErrorBoundary fallback={<div>Something went wrong in the Conversations Table.</div>}>
            <ConversationsTable />
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="knowledgebase">
          <ErrorBoundary fallback={<div>Something went wrong in the Knowledgebase.</div>}>
            <Knowledgebase />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  )
}

