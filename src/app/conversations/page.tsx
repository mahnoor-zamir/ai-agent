import { ConversationsTable } from "@/components/conversations-table"
import ErrorBoundary from "@/components/error-boundary"

export default function ConversationsPage() {
  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">Conversations</h1>
        <p className="text-lg text-muted-foreground">Manage and review your AI agent's conversations</p>
      </div>
      <ErrorBoundary fallback={<div>Something went wrong in the Conversations Table.</div>}>
        <ConversationsTable />
      </ErrorBoundary>
    </div>
  )
}

