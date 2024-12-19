import { useState, useEffect } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Paperclip, Send, ChevronDown, Plus } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ColorPicker } from "./color-picker"
import { TemplateModal } from "./template-modal"

interface Template {
  id: string;
  name: string;
  content: string;
}

interface Email {
  id: string
  sender: string
  subject: string
  body: string
  timestamp: string
}

export interface EmailComposerProps {
  isOpen: boolean
  onClose: () => void
  to?: string
  replyTo?: string
  subject?: string
  mode?: 'new' | 'reply' | 'replyAll' | 'forward'
  thread?: Email[]
}

export function EmailComposer({ isOpen, onClose, to, replyTo, subject, mode = 'new', thread = [] }: EmailComposerProps) {
  const [toField, setToField] = useState(to || '')
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [emailSubject, setEmailSubject] = useState(subject || '')
  const [body, setBody] = useState('')
  const [fontColor, setFontColor] = useState('#000000')
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif')
  const [templates, setTemplates] = useState<Template[]>([
    { id: '1', name: 'Welcome Template', content: 'Welcome to our platform! We\'re excited to have you on board.' },
    { id: '2', name: 'Follow-up Template', content: 'I hope this email finds you well. I wanted to follow up on our previous conversation.' },
  ])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)


  useEffect(() => {
    if (mode === 'reply' || mode === 'replyAll') {
      setEmailSubject(subject ? `Re: ${subject.replace(/^Re:\s*/i, '')}` : '')
      setToField(to || '')
    } else if (mode === 'forward') {
      setEmailSubject(subject ? `Fwd: ${subject.replace(/^Fwd:\s*/i, '')}` : '')
      setToField('')
    } else {
      setEmailSubject(subject || '')
      setToField(to || '')
    }
  }, [mode, subject, to])

  const handleSend = () => {
    // Here you would implement the logic to send the email
    console.log('Sending email:', { to: toField, cc, bcc, subject: emailSubject, body, fontColor, fontFamily })
    onClose()
  }


  const formatButton = (icon: React.ReactNode, label: string, action: () => void) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle aria-label={label} onClick={action}>
            {icon}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const applyFormat = (format: string) => {
    // This is a simplified example. In a real-world scenario, you'd use a rich text editor library.
    setBody(prevBody => `<${format}>${prevBody}</${format}>`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] sm:h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>{mode === 'new' ? 'New Message' : mode === 'forward' ? 'Forward' : 'Reply'}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow flex flex-col p-4 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-12 text-right text-sm font-medium">To:</span>
              <Input
                value={toField}
                onChange={(e) => setToField(e.target.value)}
                className="flex-grow"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-right text-sm font-medium">Cc:</span>
              <Input
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                className="flex-grow"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-right text-sm font-medium">Bcc:</span>
              <Input
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                className="flex-grow"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-right text-sm font-medium">Subject:</span>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="flex-grow"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-right text-sm font-medium">From:</span>
              <div className="flex items-center gap-2">
                <Avatar className="bg-muted h-8 w-8">
                  <AvatarFallback className="text-primary font-semibold text-xs">
                    {mode === 'new' ? 'ME' : replyTo?.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{mode === 'new' ? 'Me' : replyTo}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 mr-4">
                <Select
  value={selectedTemplate}
  onValueChange={(value) => {
    const template = templates.find(t => t.id === value);
    if (template) {
      setBody(template.content);
      setSelectedTemplate(value);
    } else {
      setBody("");
      setSelectedTemplate("");
    }
  }}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select a template" />
  </SelectTrigger>
  <SelectContent>
    {templates.map((template) => (
      <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
    ))}
  </SelectContent>
</Select>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedTemplate("");
                  setBody("");
                }}
                className="mr-2"
              >
                Clear
              </Button>
              <Button variant="outline" onClick={() => setIsTemplateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Template
              </Button>
            </div>
          </div>
          <div className="border rounded-md flex-grow flex flex-col">
            <div className="flex items-center gap-1 p-1 border-b">
              {formatButton(<Bold className="h-4 w-4" />, "Bold", () => applyFormat('b'))}
              {formatButton(<Italic className="h-4 w-4" />, "Italic", () => applyFormat('i'))}
              {formatButton(<Underline className="h-4 w-4" />, "Underline", () => applyFormat('u'))}
              <Separator orientation="vertical" className="mx-1 h-6" />
              {formatButton(<List className="h-4 w-4" />, "Bullet List", () => applyFormat('ul'))}
              {formatButton(<ListOrdered className="h-4 w-4" />, "Numbered List", () => applyFormat('ol'))}
              <Separator orientation="vertical" className="mx-1 h-6" />
              {formatButton(<AlignLeft className="h-4 w-4" />, "Align Left", () => applyFormat('div style="text-align: left;"'))}
              {formatButton(<AlignCenter className="h-4 w-4" />, "Align Center", () => applyFormat('div style="text-align: center;"'))}
              {formatButton(<AlignRight className="h-4 w-4" />, "Align Right", () => applyFormat('div style="text-align: right;"'))}
              <Separator orientation="vertical" className="mx-1 h-6" />
              <div className="flex items-center space-x-2">
                <ColorPicker value={fontColor} onChange={setFontColor} />
                <Select onValueChange={(value) => setFontFamily(value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                    <SelectItem value="Helvetica, sans-serif">Helvetica</SelectItem>
                    <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
                    <SelectItem value="Courier New, monospace">Courier New</SelectItem>
                    <SelectItem value="Georgia, serif">Georgia</SelectItem>
                    <SelectItem value="Palatino, serif">Palatino</SelectItem>
                    <SelectItem value="Garamond, serif">Garamond</SelectItem>
                    <SelectItem value="Bookman, serif">Bookman</SelectItem>
                    <SelectItem value="Comic Sans MS, cursive">Comic Sans MS</SelectItem>
                    <SelectItem value="Trebuchet MS, sans-serif">Trebuchet MS</SelectItem>
                    <SelectItem value="Arial Black, sans-serif">Arial Black</SelectItem>
                    <SelectItem value="Impact, sans-serif">Impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <ScrollArea className="flex-grow">
              <div className="p-4">
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[200px] border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Type your message here..."
                  style={{ color: fontColor, fontFamily: fontFamily }}
                />
                {thread.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="font-semibold mb-2">Previous Messages:</h3>
                    {thread.map((email, index) => (
                      <div key={email.id} className="mb-4 border-b pb-4 last:border-b-0">
                        <p className="font-medium">{email.sender}</p>
                        <p className="text-sm text-muted-foreground">{new Date(email.timestamp).toLocaleString()}</p>
                        <p className="mt-2 whitespace-pre-wrap">{email.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="flex justify-between items-center p-4 border-t">
          <Button onClick={handleSend} className="gap-2">
            <Send className="h-4 w-4" />
            Send
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogContent>
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={(newTemplate) => {
          const updatedTemplates = [...templates, { ...newTemplate, id: Date.now().toString() }];
          setTemplates(updatedTemplates);
          setIsTemplateModalOpen(false);
        }}
      />
    </Dialog>
  )
}

