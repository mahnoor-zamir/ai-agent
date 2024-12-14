import { WordPressEditor } from "@/components/wordpress-editor"
import ErrorBoundary from "@/components/error-boundary"

export default function WordPressEditorPage() {
  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">WordPress Editor</h1>
        <p className="text-lg text-muted-foreground">Edit your WordPress website content directly from this dashboard</p>
      </div>
      <ErrorBoundary fallback={<div>Something went wrong in the WordPress Editor.</div>}>
        <WordPressEditor />
      </ErrorBoundary>
    </div>
  )
}

