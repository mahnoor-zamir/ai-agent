import { useState } from 'react'
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
import { useToast } from "@/hooks/use-toast"

interface RequestAutomationModalProps {
  isOpen: boolean
  onClose: () => void
  isLarge?: boolean
}

export function RequestAutomationModal({ isOpen, onClose, isLarge = false }: RequestAutomationModalProps) {
  const [message, setMessage] = useState('')
  const { toast } = useToast()

  const handleSendRequest = async () => {
    if (message.length > 1000) {
      toast({
        title: "Error",
        description: "Your message is too long. Please limit it to 1000 characters.",
        variant: "destructive",
      });
      return;
    }
    // In a real application, you would implement an API call here
    // For this example, we'll just log the message
    console.log(`Sending request to abed@teamvenuex.com: ${message}`)
    
    // Here you would typically make an API call, e.g.:
    // await fetch('/api/send-automation-request', {
    //   method: 'POST',
    //   body: JSON.stringify({ message, recipient: 'abed@teamvenuex.com' }),
    //   headers: { 'Content-Type': 'application/json' },
    // })

    toast({
      title: "Request Sent",
      description: "Your custom automation request has been sent successfully.",
    });

    // Reset the form and close the modal
    setMessage('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Request Custom Automation</DialogTitle>
          <DialogDescription>
            Describe the automation you need in detail. Include any specific triggers, actions, or conditions you want the automation to handle. Your request will be sent to our team for review and implementation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Describe the automation you need..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={10}
          />
          <div className="text-sm text-muted-foreground text-right">
            {message.length} / 1000 characters
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSendRequest} disabled={!message.trim()}>
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

