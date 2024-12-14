import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MarketingPage() {
  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">Marketing Dashboard</h1>
        <p className="text-lg text-muted-foreground">Manage your marketing campaigns and analytics</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Google Ads</CardTitle>
            <CardDescription>Manage your Google Ads campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/marketing/google-ads">Manage Google Ads</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Meta Ads</CardTitle>
            <CardDescription>Manage your Meta Ads campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/marketing/meta-ads">Manage Meta Ads</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Google Analytics</CardTitle>
            <CardDescription>View your Google Analytics data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/marketing/google-analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

