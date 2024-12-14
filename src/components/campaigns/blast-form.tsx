"use client"

import { useState, useEffect } from "react"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette, List } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Toggle } from "@/components/ui/toggle"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
}

interface MessageStyles {
  bold: boolean
  italic: boolean
  underline: boolean
  align: 'left' | 'center' | 'right'
  color: string
  fontFamily: string
}


const contacts: Contact[] = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+1234567890" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+1234567891" },
  // Add more sample contacts
]

export function BlastForm() {
  const [messageType, setMessageType] = useState<"email" | "sms" | "both">("email")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [emailSubject, setEmailSubject] = useState('')
  const [emailContent, setEmailContent] = useState('')
  const [smsContent, setSmsContent] = useState('')
  const [styles, setStyles] = useState<MessageStyles>({
    bold: false,
    italic: false,
    underline: false,
    align: 'left',
    color: '#000000',
    fontFamily: 'Arial, sans-serif',
  })
  const [includeSignature, setIncludeSignature] = useState(false)
  const [signature, setSignature] = useState('')

  useEffect(() => {
    // In a real application, this would be an API call to fetch the user's signature
    const fetchSignature = async () => {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setSignature("Best regards,\nJohn Doe\nSales Manager")
    }
    fetchSignature()
  }, [])

  const handleStyleChange = (key: keyof MessageStyles, value: any) => {
    setStyles(prev => ({ ...prev, [key]: value }))
  }

  const insertBulletPoint = () => {
    const textarea = document.getElementById('emailContent') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const bulletPoint = '\n• ';
      const newText = before + bulletPoint + after;
      setEmailContent(newText);
      textarea.focus();
      textarea.setSelectionRange(start + bulletPoint.length, start + bulletPoint.length);
    }
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const finalEmailContent = includeSignature ? `${emailContent}\n\n${signature}` : emailContent

    // Implement blast sending logic here
    console.log("Sending blast:", { 
      messageType, 
      selectedContacts, 
      emailSubject, 
      emailContent: finalEmailContent, 
      smsContent,
      emailStyles: styles
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Blast</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Message Type</Label>
            <Select
              value={messageType}
              onValueChange={(value) => setMessageType(value as "email" | "sms" | "both")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select message type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="both">Both Email & SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Recipients</Label>
            <div className="border rounded-md p-4 space-y-2">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={contact.id}
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedContacts([...selectedContacts, contact.id])
                      } else {
                        setSelectedContacts(selectedContacts.filter(id => id !== contact.id))
                      }
                    }}
                  />
                  <Label htmlFor={contact.id} className="flex-1">
                    {contact.name} ({messageType === 'sms' ? contact.phone : contact.email})
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {(messageType === 'email' || messageType === 'both') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="Enter email subject" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailContent">Email Content</Label>
                <div className="border rounded-md p-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Toggle pressed={styles.bold} onPressedChange={(pressed) => handleStyleChange('bold', pressed)} aria-label="Toggle bold">
                      <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle pressed={styles.italic} onPressedChange={(pressed) => handleStyleChange('italic', pressed)} aria-label="Toggle italic">
                      <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle pressed={styles.underline} onPressedChange={(pressed) => handleStyleChange('underline', pressed)} aria-label="Toggle underline">
                      <Underline className="h-4 w-4" />
                    </Toggle>
                    <Toggle pressed={styles.align === 'left'} onPressedChange={() => handleStyleChange('align', 'left')} aria-label="Align left">
                      <AlignLeft className="h-4 w-4" />
                    </Toggle>
                    <Toggle pressed={styles.align === 'center'} onPressedChange={() => handleStyleChange('align', 'center')} aria-label="Align center">
                      <AlignCenter className="h-4 w-4" />
                    </Toggle>
                    <Toggle pressed={styles.align === 'right'} onPressedChange={() => handleStyleChange('align', 'right')} aria-label="Align right">
                      <AlignRight className="h-4 w-4" />
                    </Toggle>
                    <Button variant="outline" size="icon" onClick={insertBulletPoint}>
                      <List className="h-4 w-4" />
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[65px] h-8 px-2">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: styles.color }} />
                          <Palette className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40">
                        <div className="flex flex-wrap gap-1">
                          {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map((color) => (
                            <button
                              key={color}
                              className="w-6 h-6 rounded-full cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              style={{ backgroundColor: color }}
                              onClick={() => handleStyleChange('color', color)}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Select onValueChange={(value) => handleStyleChange('fontFamily', value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                        <SelectItem value="Helvetica, sans-serif">Helvetica</SelectItem>
                        <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
                        <SelectItem value="Courier New, monospace">Courier New</SelectItem>
                        {/* Add more font options as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    id="emailContent"
                    placeholder="Enter email content"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={10}
                    className="min-h-[200px]"
                    style={{
                      fontWeight: styles.bold ? 'bold' : 'normal',
                      fontStyle: styles.italic ? 'italic' : 'normal',
                      textDecoration: styles.underline ? 'underline' : 'none',
                      textAlign: styles.align,
                      color: styles.color,
                      fontFamily: styles.fontFamily,
                    }}
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="include-signature"
                      checked={includeSignature}
                      onCheckedChange={(checked) => setIncludeSignature(checked as boolean)}
                    />
                    <Label htmlFor="include-signature">Include signature from settings</Label>
                  </div>
                </div>
              </div>
            </>
          )}

          {(messageType === 'sms' || messageType === 'both') && (
            <div className="space-y-2">
              <Label htmlFor="smsContent">SMS Content</Label>
              <Textarea 
                id="smsContent" 
                placeholder="Enter SMS content" 
                rows={3}
                maxLength={160}
                value={smsContent}
                onChange={(e) => setSmsContent(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Maximum 160 characters
              </p>
            </div>
          )}

          <Button type="submit" className="w-full">
            Send Blast
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

