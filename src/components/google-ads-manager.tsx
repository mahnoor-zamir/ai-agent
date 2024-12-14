"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function GoogleAdsManager() {
  const [budget, setBudget] = useState('')
  const [keywords, setKeywords] = useState('')

  const handleSave = () => {
    // Implement save logic here
    console.log('Saving Google Ads settings:', { budget, keywords })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Google Ads Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Daily Budget</Label>
          <Input
            id="budget"
            placeholder="Enter daily budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Input
            id="keywords"
            placeholder="Enter keywords (comma-separated)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </CardContent>
    </Card>
  )
}

