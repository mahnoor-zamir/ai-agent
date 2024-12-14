"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function MetaAdsManager() {
  const [budget, setBudget] = useState('')
  const [targetAudience, setTargetAudience] = useState('')

  const handleSave = () => {
    // Implement save logic here
    console.log('Saving Meta Ads settings:', { budget, targetAudience })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Meta Ads Manager</CardTitle>
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
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Input
            id="targetAudience"
            placeholder="Enter target audience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </CardContent>
    </Card>
  )
}

