import { MetaAdsManager } from "@/components/meta-ads-manager"

export default function MetaAdsPage() {
  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">Meta Ads Manager</h1>
        <p className="text-lg text-muted-foreground">Manage your Meta Ads campaigns</p>
      </div>
      <MetaAdsManager />
    </div>
  )
}

