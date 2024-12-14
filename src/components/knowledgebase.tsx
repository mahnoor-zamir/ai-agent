"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Knowledgebase() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Knowledgebase</CardTitle>
        <CardDescription>Access and manage your knowledge resources</CardDescription>
      </CardHeader>
      <CardContent>
        <p>The AI Knowledgebase content has been moved to the AI Settings section in the Settings page.</p>
      </CardContent>
    </Card>
  )
}

