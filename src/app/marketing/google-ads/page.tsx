import { GoogleAdsManager } from "@/components/google-ads-manager"

export default function GoogleAdsPage() {
  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">Google Ads Manager</h1>
        <p className="text-lg text-muted-foreground">Manage your Google Ads campaigns</p>
      </div>
      <GoogleAdsManager />
    </div>
  )
}

