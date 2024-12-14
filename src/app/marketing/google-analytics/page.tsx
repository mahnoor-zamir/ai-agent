import { GoogleAnalyticsViewer } from "@/components/google-analytics-viewer"

export default function GoogleAnalyticsPage() {
  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">Google Analytics Viewer</h1>
        <p className="text-lg text-muted-foreground">View your Google Analytics data</p>
      </div>
      <GoogleAnalyticsViewer />
    </div>
  )
}

