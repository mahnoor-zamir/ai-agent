import { EmailSettings } from "@/components/email-settings"
import { WebsiteSettings } from "@/components/website-settings"
import ErrorBoundary from "@/components/error-boundary"
import { Accordion } from "@/components/ui/accordion" // Import Accordion component

export default function SettingsPage() {
  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-lg text-muted-foreground">Configure your settings</p>
      </div>
      <Accordion type="single" collapsible className="w-full"> {/* Wrap settings in Accordion */}
        <ErrorBoundary fallback={<div>Something went wrong in the Email Settings.</div>}>
          <EmailSettings />
        </ErrorBoundary>
        <ErrorBoundary fallback={<div>Something went wrong in the Website Settings.</div>}>
          <WebsiteSettings onLogin={
            async (siteUrl, username, password) => {
              console.log("Logging in with:", { siteUrl, username, password })
            }
          } />
        </ErrorBoundary>
      </Accordion>
    </div>
  )
}

