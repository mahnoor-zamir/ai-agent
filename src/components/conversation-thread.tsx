import { format } from 'date-fns'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Email {
  id: string
  sender: string
  subject: string
  body: string
  timestamp: string
}

interface ConversationThreadProps {
  emails: Email[]
}

export function ConversationThread({ emails }: ConversationThreadProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {emails.map((email, index) => (
          <div key={email.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Avatar className="bg-muted h-8 w-8">
                  <AvatarFallback className="text-primary font-semibold">
                    {email.sender.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{email.sender}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(email.timestamp), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </div>
            <h3 className="font-medium mb-2">{email.subject}</h3>
            <div className="text-sm whitespace-pre-wrap">{email.body}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

