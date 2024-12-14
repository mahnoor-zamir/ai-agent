import { useState, useEffect } from 'react'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette, List, Type } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toggle } from "@/components/ui/toggle"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

interface ReviewRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (timing: string, message: string, styles: MessageStyles) => void
}

interface MessageStyles {
  bold: boolean
  italic: boolean
  underline: boolean
  align: 'left' | 'center' | 'right'
  color: string
  fontFamily: string
}

export function ReviewRequestModal({ isOpen, onClose, onSave }: ReviewRequestModalProps) {
  const [timing, setTiming] = useState('1_day')
  const [message, setMessage] = useState('')
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
  const { toast } = useToast()

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
    const textarea = document.getElementById('message') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const bulletPoint = '\n• ';
      const newText = before + bulletPoint + after;
      setMessage(newText);
      textarea.focus();
      textarea.setSelectionRange(start + bulletPoint.length, start + bulletPoint.length);
    }
  }

  const handleSave = () => {
    if (!timing || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    const finalMessage = includeSignature ? `${message}\n\n${signature}` : message
    onSave(timing, finalMessage, styles)
    toast({
      title: "Configuration Saved",
      description: "Your review request automation has been updated.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] p-6 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold">Configure Review Request</DialogTitle>
          <DialogDescription>
            Set up when to send the review request and customize the message.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="edit" className="flex flex-col h-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
          <ScrollArea className="flex-grow mt-4">
            <div className="pr-4">
              <TabsContent value="edit" className="space-y-6">
                <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                  <Label htmlFor="timing" className="whitespace-nowrap">
                    Send after
                  </Label>
                  <Select value={timing} onValueChange={setTiming}>
                    <SelectTrigger id="timing" className="w-full">
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1_day">1 day</SelectItem>
                      <SelectItem value="3_days">3 days</SelectItem>
                      <SelectItem value="1_week">1 week</SelectItem>
                      <SelectItem value="2_weeks">2 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <div className="border rounded-md p-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Toggle
                        pressed={styles.bold}
                        onPressedChange={(pressed) => handleStyleChange('bold', pressed)}
                        aria-label="Toggle bold"
                      >
                        <Bold className="h-4 w-4" />
                      </Toggle>
                      <Toggle
                        pressed={styles.italic}
                        onPressedChange={(pressed) => handleStyleChange('italic', pressed)}
                        aria-label="Toggle italic"
                      >
                        <Italic className="h-4 w-4" />
                      </Toggle>
                      <Toggle
                        pressed={styles.underline}
                        onPressedChange={(pressed) => handleStyleChange('underline', pressed)}
                        aria-label="Toggle underline"
                      >
                        <Underline className="h-4 w-4" />
                      </Toggle>
                      <Toggle
                        pressed={styles.align === 'left'}
                        onPressedChange={() => handleStyleChange('align', 'left')}
                        aria-label="Align left"
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Toggle>
                      <Toggle
                        pressed={styles.align === 'center'}
                        onPressedChange={() => handleStyleChange('align', 'center')}
                        aria-label="Align center"
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Toggle>
                      <Toggle
                        pressed={styles.align === 'right'}
                        onPressedChange={() => handleStyleChange('align', 'right')}
                        aria-label="Align right"
                      >
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
                    <Textarea
                      id="message"
                      placeholder="Enter your review request message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
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
              </TabsContent>
              <TabsContent value="preview" className="space-y-6">
                <div className="border rounded-md p-4 min-h-[200px] bg-white">
                  <div
                    className="whitespace-pre-wrap"
                    style={{
                      fontWeight: styles.bold ? 'bold' : 'normal',
                      fontStyle: styles.italic ? 'italic' : 'normal',
                      textDecoration: styles.underline ? 'underline' : 'none',
                      textAlign: styles.align,
                      color: styles.color,
                      fontFamily: styles.fontFamily,
                    }}
                  >
                    {message || 'Your message preview will appear here.'}
                    {includeSignature && (
                      <>
                        <br /><br />
                        {signature}
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
        <DialogFooter className="mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

