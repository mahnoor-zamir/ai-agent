"use client"

import { useState } from 'react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bold, Italic, Paperclip, Palette } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Lead {
  id: string
  name: string
  email: string
  timestamp: string
  emailPreview: string
}

interface LeadDetailsDialogProps {
  lead: Lead
  isOpen: boolean
  onClose: () => void
}

export function LeadDetailsDialog({ lead, isOpen, onClose }: LeadDetailsDialogProps) {
  const [to, setTo] = useState(lead.email)
  const [subject, setSubject] = useState(`Re: ${lead.emailPreview.slice(0, 50)}...`)
  const [message, setMessage] = useState('')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [fontColor, setFontColor] = useState('#000000')
  const [attachments, setAttachments] = useState<File[]>([])

  const toggleBold = () => setIsBold(!isBold)
  const toggleItalic = () => setIsItalic(!isItalic)
  const handleColorChange = (color: string) => setFontColor(color)
  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const handleSendReply = () => {
    // Implement the logic to send the reply
    console.log('Sending reply:', { to, subject, message, attachments })
    setTo('')
    setSubject('')
    setMessage('')
    setAttachments([])
    onClose()
  }

  // This would typically come from your data fetching logic
  const emailThread = [
    {
      sender: 'AI Assistant',
      content: 'Hello! Thank you for your interest. How may I assist you today?',
      timestamp: '2023-05-10T17:00:00Z',
    },
    {
      sender: lead.name,
      content: lead.emailPreview,
      timestamp: lead.timestamp,
    },
    {
      sender: 'AI Assistant',
      content: 'I apologize, but I\'m having trouble processing your request. A human agent will get back to you shortly.',
      timestamp: new Date(new Date(lead.timestamp).getTime() + 5 * 60000).toISOString(), // 5 minutes later
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Lead Details: {lead.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="space-y-4 p-4">
            {emailThread.map((email, index) => (
              <div key={index} className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{email.sender}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(email.timestamp), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <p>{email.content}</p>
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <div className="border rounded-md p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={toggleBold}
                    className={isBold ? 'bg-muted' : ''}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={toggleItalic}
                    className={isItalic ? 'bg-muted' : ''}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" size="icon">
                        <Palette className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                      <div className="flex flex-wrap gap-1">
                        {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map((color) => (
                          <div
                            key={color}
                            className="w-6 h-6 rounded-full cursor-pointer border border-gray-300"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleAttachment}
                  />
                </div>
                <Textarea
                  id="message"
                  placeholder="Type your reply here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={10}
                  className="min-h-[200px]"
                  style={{
                    fontWeight: isBold ? 'bold' : 'normal',
                    fontStyle: isItalic ? 'italic' : 'normal',
                    color: fontColor,
                  }}
                />
              </div>
              {attachments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Attachments:</p>
                  <ul className="list-disc list-inside">
                    {attachments.map((file, index) => (
                      <li key={index} className="text-sm">{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSendReply}>Send Reply</Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

