import { Knowledgebase } from "@/components/knowledgebase"
import ErrorBoundary from "@/components/error-boundary"

export default function KnowledgebasePage() {
  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">Knowledgebase</h1>
        <p className="text-lg text-muted-foreground">Manage your AI agent's knowledge and training data</p>
      </div>
      <ErrorBoundary fallback={<div>Something went wrong in the Knowledgebase.</div>}>
        <Knowledgebase />
      </ErrorBoundary>
    </div>
  )
}

