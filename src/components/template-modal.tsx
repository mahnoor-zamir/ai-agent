import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { ColorPicker } from "./color-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Paperclip } from 'lucide-react'

interface Template {
  id: string;
  name: string;
  content: string;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Omit<Template, 'id'>) => void;
  editingTemplate?: Template;
}

export function TemplateModal({ isOpen, onClose, onSave, editingTemplate }: TemplateModalProps) {
  const [name, setName] = useState(editingTemplate?.name || '')
  const [content, setContent] = useState(editingTemplate?.content || '')
  const [fontColor, setFontColor] = useState('#000000')
  const [fontSize, setFontSize] = useState('16px')
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [alignment, setAlignment] = useState('left')
  const [attachments, setAttachments] = useState<File[]>([])

  const handleSave = () => {
    onSave({ name, content })
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setName('')
    setContent('')
    setFontColor('#000000')
    setFontSize('16px')
    setFontFamily('Arial, sans-serif')
    setIsBold(false)
    setIsItalic(false)
    setIsUnderline(false)
    setAlignment('left')
    setAttachments([])
  }

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const applyStyle = (style: string) => {
    setContent((prevContent) => `<${style}>${prevContent}</${style}>`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingTemplate ? 'Edit Email Template' : 'Create New Email Template'}
          </DialogTitle>
          <DialogDescription>
            {editingTemplate ? 'Modify your existing email template.' : 'Design a new email template to streamline your communication.'}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="design" className="flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="design" className="flex-grow flex flex-col gap-6 py-4 overflow-hidden">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Template Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for your template"
                className="w-full"
              />
            </div>
            <div className="space-y-2 flex-grow overflow-hidden">
              <Label htmlFor="content" className="text-sm font-medium">
                Template Content
              </Label>
              <div className="border rounded-md p-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <Toggle pressed={isBold} onPressedChange={setIsBold} aria-label="Toggle bold">
                    <Bold className="h-4 w-4" />
                  </Toggle>
                  <Toggle pressed={isItalic} onPressedChange={setIsItalic} aria-label="Toggle italic">
                    <Italic className="h-4 w-4" />
                  </Toggle>
                  <Toggle pressed={isUnderline} onPressedChange={setIsUnderline} aria-label="Toggle underline">
                    <Underline className="h-4 w-4" />
                  </Toggle>
                  <Separator orientation="vertical" className="h-6" />
                  <Toggle pressed={alignment === 'left'} onPressedChange={() => setAlignment('left')} aria-label="Align left">
                    <AlignLeft className="h-4 w-4" />
                  </Toggle>
                  <Toggle pressed={alignment === 'center'} onPressedChange={() => setAlignment('center')} aria-label="Align center">
                    <AlignCenter className="h-4 w-4" />
                  </Toggle>
                  <Toggle pressed={alignment === 'right'} onPressedChange={() => setAlignment('right')} aria-label="Align right">
                    <AlignRight className="h-4 w-4" />
                  </Toggle>
                  <Separator orientation="vertical" className="h-6" />
                  <ColorPicker value={fontColor} onChange={setFontColor} />
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="Font size" />
                    </SelectTrigger>
                    <SelectContent>
                      {['12px', '14px', '16px', '18px', '20px', '24px'].map((size) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                      <SelectItem value="Helvetica, sans-serif">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
                      <SelectItem value="Courier New, monospace">Courier New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ScrollArea className="h-[calc(100%-3rem)] border rounded-md">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your email template content here..."
                    className="w-full h-full min-h-[300px] p-2 resize-none focus:outline-none"
                    style={{
                      fontWeight: isBold ? 'bold' : 'normal',
                      fontStyle: isItalic ? 'italic' : 'normal',
                      textDecoration: isUnderline ? 'underline' : 'none',
                      textAlign: alignment,
                      color: fontColor,
                      fontSize: fontSize,
                      fontFamily: fontFamily,
                    }}
                  />
                </ScrollArea>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                <Paperclip className="mr-2 h-4 w-4" />
                Attach Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleAttachment}
              />
              {attachments.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {attachments.length} file(s) attached
                </span>
              )}
            </div>
          </TabsContent>
          <TabsContent value="preview" className="flex-grow overflow-hidden">
            <ScrollArea className="h-full border rounded-md p-4">
              <div
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textDecoration: isUnderline ? 'underline' : 'none',
                  textAlign: alignment,
                  color: fontColor,
                  fontSize: fontSize,
                  fontFamily: fontFamily,
                }}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim() || !content.trim()}>
            {editingTemplate ? 'Update Template' : 'Save Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

