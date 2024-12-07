"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FollowUpTemplate {
  content: string
  schedule: string
}

export function EmailSettings() {
  const [connectedEmail, setConnectedEmail] = useState<"gmail" | "outlook" | null>(null)
  const [initialReply, setInitialReply] = useState("")
  const [followUpTemplates, setFollowUpTemplates] = useState<FollowUpTemplate[]>([
    { content: "", schedule: "3" },
    { content: "", schedule: "7" },
    { content: "", schedule: "14" },
    { content: "", schedule: "30" },
  ])
  const [emailSignature, setEmailSignature] = useState("")
  const [aiName, setAiName] = useState("")

  const handleConnectEmail = (provider: "gmail" | "outlook") => {
    // Implement email connection logic here
    setConnectedEmail(provider)
  }

  const handleUpdateSettings = () => {
    // Implement update logic here
    console.log("Updating settings:", {
      initialReply,
      followUpTemplates,
      emailSignature,
      aiName
    })
  }

  const updateFollowUpTemplate = (index: number, field: keyof FollowUpTemplate, value: string) => {
    const newTemplates = [...followUpTemplates]
    newTemplates[index] = { ...newTemplates[index], [field]: value }
    setFollowUpTemplates(newTemplates)
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>Manage your AI Sales Agent email settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="email-accounts">
              <AccordionTrigger>Email Accounts</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Gmail</h3>
                      <p className="text-sm text-muted-foreground">Connect your Gmail account</p>
                    </div>
                    {connectedEmail === "gmail" ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                    ) : (
                      <div className="space-x-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">Not Connected</Badge>
                        <Button onClick={() => handleConnectEmail("gmail")}>Connect</Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Outlook</h3>
                      <p className="text-sm text-muted-foreground">Connect your Outlook account</p>
                    </div>
                    {connectedEmail === "outlook" ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                    ) : (
                      <div className="space-x-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">Not Connected</Badge>
                        <Button onClick={() => handleConnectEmail("outlook")}>Connect</Button>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ai-response-templates">
              <AccordionTrigger>AI Response Templates</AccordionTrigger>
              <AccordionContent>
                <Tabs defaultValue="initial-reply" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="initial-reply">Initial Reply</TabsTrigger>
                    <TabsTrigger value="follow-up-1">Follow-up 1</TabsTrigger>
                    <TabsTrigger value="follow-up-2">Follow-up 2</TabsTrigger>
                    <TabsTrigger value="follow-up-3">Follow-up 3</TabsTrigger>
                    <TabsTrigger value="follow-up-4">Follow-up 4</TabsTrigger>
                  </TabsList>
                  <TabsContent value="initial-reply">
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="initial-reply">Initial AI Reply Template</Label>
                      <Textarea
                        id="initial-reply"
                        placeholder="Enter the initial reply template for AI..."
                        value={initialReply}
                        onChange={(e) => setInitialReply(e.target.value)}
                        rows={10}
                        className="min-h-[200px]"
                      />
                    </div>
                  </TabsContent>
                  {followUpTemplates.map((template, index) => (
                    <TabsContent key={index} value={`follow-up-${index + 1}`}>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center space-x-4">
                          <Label htmlFor={`follow-up-${index + 1}-schedule`} className="min-w-[100px]">
                            Send after
                          </Label>
                          <Select
                            value={template.schedule}
                            onValueChange={(value) => updateFollowUpTemplate(index, 'schedule', value)}
                          >
                            <SelectTrigger id={`follow-up-${index + 1}-schedule`} className="w-[180px]">
                              <SelectValue placeholder="Select days" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 day</SelectItem>
                              <SelectItem value="3">3 days</SelectItem>
                              <SelectItem value="7">1 week</SelectItem>
                              <SelectItem value="14">2 weeks</SelectItem>
                              <SelectItem value="30">1 month</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-muted-foreground">
                            after the previous message
                          </span>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`follow-up-${index + 1}`}>Follow-up Template {index + 1}</Label>
                          <Textarea
                            id={`follow-up-${index + 1}`}
                            placeholder={`Enter follow-up template ${index + 1}...`}
                            value={template.content}
                            onChange={(e) => updateFollowUpTemplate(index, 'content', e.target.value)}
                            rows={10}
                            className="min-h-[200px]"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="general-settings">
              <AccordionTrigger>General Settings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-name">AI Agent Name</Label>
                    <Input
                      id="ai-name"
                      placeholder="Enter AI agent name..."
                      value={aiName}
                      onChange={(e) => setAiName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signature">Email Signature</Label>
                    <Textarea
                      id="email-signature"
                      placeholder="Enter your email signature..."
                      value={emailSignature}
                      onChange={(e) => setEmailSignature(e.target.value)}
                      rows={5}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleUpdateSettings} size="lg">Save All Settings</Button>
      </div>
    </div>
  )
}

