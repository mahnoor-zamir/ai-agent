// "use client";

// import { useState, useEffect } from 'react'
// import { Star, Paperclip, MoreHorizontal, Archive, Trash2, AlertOctagon, Tag, Search, Mail, Reply, ReplyAll, Forward, RefreshCcw } from 'lucide-react'
// import { format, formatDistanceToNow } from 'date-fns'

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { EmailComposer, EmailComposerProps } from "@/components/email-composer"
// import { ConversationThread } from "@/components/conversation-thread"
// import { exportToExcel } from "@/utils/excel-export"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"

// interface Email {
//   id: string
//   sender: string
//   subject: string
//   body: string
//   timestamp: string
// }

// interface Conversation {
//   id: string
//   subject: string
//   sender: string
//   preview: string
//   timestamp: string
//   hasAttachment: boolean
//   isStarred: boolean
//   aiReplied: boolean
//   labels: string[]
//   thread: Email[]
// }

// const conversations: Conversation[] = [
//   {
//     id: "1",
//     subject: "Booking Confirmation",
//     sender: "John Doe",
//     preview: "Thank you for booking a tour with us...",
//     timestamp: "2024-01-10T14:30:00Z",
//     hasAttachment: true,
//     isStarred: true,
//     aiReplied: true,
//     labels: ['Important', 'Booking'],
//     thread: [
//       {
//         id: "1-1",
//         sender: "John Doe",
//         subject: "Booking Confirmation",
//         body: "Thank you for booking a tour with us. We're excited to have you join us on [DATE] for [TOUR NAME]. Please find attached your booking confirmation and itinerary. If you have any questions or need to make changes, please don't hesitate to contact us.",
//         timestamp: "2024-01-10T14:30:00Z",
//       },
//       {
//         id: "1-2",
//         sender: "AI Assistant",
//         subject: "Re: Booking Confirmation",
//         body: "Thank you for your booking. I've processed your request and everything looks good. Is there anything else you need assistance with regarding your upcoming tour?",
//         timestamp: "2024-01-10T14:35:00Z",
//       },
//     ],
//   },
//   {
//     id: "2",
//     subject: "Follow-up Questions",
//     sender: "Jane Smith",
//     preview: "I have a few questions about the property...",
//     timestamp: "2024-01-09T09:15:00Z",
//     hasAttachment: false,
//     isStarred: false,
//     aiReplied: false,
//     labels: ['Follow-up'],
//     thread: [
//       {
//         id: "2-1",
//         sender: "Jane Smith",
//         subject: "Follow-up Questions",
//         body: "Hello,\n\nI recently viewed one of your properties and I have a few questions:\n\n1. What is the square footage of the living room?\n2. Are pets allowed in the building?\n3. Is there assigned parking?\n\nThank you for your time,\nJane Smith",
//         timestamp: "2024-01-09T09:15:00Z",
//       },
//     ],
//   },
//   {
//     id: "3",
//     subject: "Tour Rescheduling",
//     sender: "Alice Johnson",
//     preview: "I need to reschedule my tour for next week...",
//     timestamp: "2024-01-08T16:45:00Z",
//     hasAttachment: false,
//     isStarred: false,
//     aiReplied: true,
//     labels: ['Booking'],
//     thread: [
//       {
//         id: "3-1",
//         sender: "Alice Johnson",
//         subject: "Tour Rescheduling",
//         body: "Dear [Agent Name],\n\nI'm writing to request a rescheduling of my property tour that was originally set for [ORIGINAL DATE]. Due to an unexpected conflict, I'm hoping we can move it to sometime next week. I'm generally available in the afternoons. Please let me know what dates and times work best for you.\n\nThank you for your understanding,\nAlice Johnson",
//         timestamp: "2024-01-08T16:45:00Z",
//       },
//       {
//         id: "3-2",
//         sender: "AI Assistant",
//         subject: "Re: Tour Rescheduling",
//         body: "Hello Alice,\n\nI understand you need to reschedule your property tour. I'd be happy to help you with that. Here are some available time slots for next week:\n\n- Monday, 2:00 PM\n- Tuesday, 3:30 PM\n- Thursday, 1:00 PM\n\nPlease let me know which of these works best for you, or if you need more options. We'll do our best to accommodate your schedule.\n\nBest regards,\nAI Assistant",
//         timestamp: "2024-01-08T17:00:00Z",
//       },
//     ],
//   },
// ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

// function formatTimestamp(timestamp: string): string {
//   const date = new Date(timestamp)
//   const formattedDate = format(date, 'MMM d, yyyy')
//   const formattedTime = format(date, 'h:mm a')
//   const timeAgo = formatDistanceToNow(date, { addSuffix: true })
//   return `${formattedDate} at ${formattedTime} (${timeAgo})`
// }

// export function ConversationsTable() {
//   const [selectedConversations, setSelectedConversations] = useState<string[]>([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [isComposerOpen, setIsComposerOpen] = useState(false)
//   const [selectedEmail, setSelectedEmail] = useState<Conversation | null>(null)
//   const [emailMode, setEmailMode] = useState<'new' | 'reply' | 'replyAll' | 'forward'>('new')
//   const [composerProps, setComposerProps] = useState<Partial<EmailComposerProps>>({})

//   const itemsPerPage = 10
//   const filteredConversations = conversations.filter(
//     conv => conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             conv.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             conv.preview.toLowerCase().includes(searchTerm.toLowerCase())
//   )
//   const totalPages = Math.ceil(filteredConversations.length / itemsPerPage)
//   const paginatedConversations = filteredConversations.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   )

//   const handleExport = () => {
//     const exportData = conversations.map(conv => ({
//       ...conv,
//       timestamp: formatTimestamp(conv.timestamp)
//     }))
//     exportToExcel(exportData, 'conversations')
//   }

//   const handleSelectAll = () => {
//     if (selectedConversations.length === paginatedConversations.length) {
//       setSelectedConversations([])
//     } else {
//       setSelectedConversations(paginatedConversations?.map(conv => conv.id) ?? [])
//     }
//   }

//   const handleSelect = (id: string) => {
//     setSelectedConversations(prev =>
//       prev.includes(id) ? prev.filter(convId => convId !== id) : [...prev, id]
//     )
//   }

//   const handleBulkAction = (action: string) => {
//     console.log(`Performing ${action} on:`, selectedConversations)
//     // Implement bulk action logic here
//     setSelectedConversations([])
//   }

//   const handleEmailAction = (action: 'reply' | 'replyAll' | 'forward') => {
//     if (selectedEmail) {
//       setEmailMode(action)
//       const lastEmail = selectedEmail.thread[selectedEmail.thread.length - 1]
//       const to = action === 'forward' ? '' : lastEmail.sender
//       setIsComposerOpen(true)
//       setComposerProps({
//         to,
//         replyTo: lastEmail.sender,
//         subject: selectedEmail.subject,
//         mode: action,
//         thread: selectedEmail.thread,
//       })
//     }
//   }

//   useEffect(() => {
//     if (conversations.length > 0) {
//       setSelectedEmail(conversations[0]);
//     }
//   }, []);

//   return (
//     <div className="flex h-[calc(100vh-4rem)] bg-background">
//       <div className="w-80 border-r flex flex-col">
//         <div className="p-4 border-b">
//           <div className="flex items-center space-x-2 mb-4">
//             <Button onClick={() => {
//               setSelectedEmail(null)
//               setEmailMode('new')
//               setIsComposerOpen(true)
//               setComposerProps({
//                 to: '',
//                 replyTo: '',
//                 subject: '',
//                 mode: 'new',
//                 thread: [],
//               })
//             }} className="flex-1">
//               <Mail className="mr-2 h-4 w-4" /> Compose
//             </Button>
//             <Button variant="outline" size="icon">
//               <RefreshCcw className="h-4 w-4" />
//             </Button>
//           </div>
//           <div className="relative">
//             <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search emails..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-8"
//             />
//           </div>
//         </div>
//         <ScrollArea className="flex-1">
//           {paginatedConversations && paginatedConversations.length > 0 ? (
//             paginatedConversations?.map((conversation) => (
//               <div
//                 key={conversation.id}
//                 className={`p-4 border-b cursor-pointer hover:bg-accent ${selectedEmail?.id === conversation.id ? 'bg-accent' : ''}`}
//                 onClick={() => setSelectedEmail(conversation)}
//               >
//                 <div className="flex items-center space-x-4">
//                   <Avatar className="bg-muted">
//                     <AvatarFallback className="text-primary font-semibold">
//                       {conversation.sender.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between">
//                       <p className="text-sm font-medium truncate">{conversation.sender}</p>
//                       <span className="text-xs text-muted-foreground">{format(new Date(conversation.timestamp), 'MMM d, yyyy')}</span>
//                     </div>
//                     <h4 className="text-sm font-semibold truncate">{conversation.subject}</h4>
//                     <p className="text-xs text-muted-foreground truncate">{conversation.preview}</p>
//                   </div>
//                 </div>
//                 <div className="mt-2 flex items-center space-x-2">
//                   {conversation.labels.map((label) => (
//                     <Badge key={label} variant="secondary" className="text-xs">
//                       {label}
//                     </Badge>
//                   ))}
//                   {conversation.hasAttachment && <Paperclip className="h-3 w-3 text-muted-foreground" />}
//                   {conversation.isStarred && <Star className="h-3 w-3 text-yellow-400 fill-current" />}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="p-4 text-center text-muted-foreground">No emails found</div>
//           )}
//         </ScrollArea>
//       </div>
//       <div className="flex-1 overflow-hidden flex flex-col">
//         {selectedEmail ? (
//           <>
//             <div className="p-4 border-b">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold">{selectedEmail.subject}</h2>
//                 <div className="space-x-2">
//                   <Button variant="outline" size="sm" onClick={() => handleEmailAction('reply')}>
//                     <Reply className="mr-2 h-4 w-4" /> Reply
//                   </Button>
//                   <Button variant="outline" size="sm" onClick={() => handleEmailAction('replyAll')}>
//                     <ReplyAll className="mr-2 h-4 w-4" /> Reply All
//                   </Button>
//                   <Button variant="outline" size="sm" onClick={() => handleEmailAction('forward')}>
//                     <Forward className="mr-2 h-4 w-4" /> Forward
//                   </Button>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="outline" size="sm">
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>
//                         <Archive className="mr-2 h-4 w-4" /> Archive
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <Trash2 className="mr-2 h-4 w-4" /> Delete
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <AlertOctagon className="mr-2 h-4 w-4" /> Mark as spam
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem>
//                         <Tag className="mr-2 h-4 w-4" /> Add label
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <Avatar className="bg-muted">
//                   <AvatarFallback className="text-primary font-semibold">
//                     {selectedEmail?.sender?.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2) ?? 'N/A'}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-semibold">{selectedEmail.sender}</p>
//                   <p className="text-sm text-muted-foreground">{formatTimestamp(selectedEmail.timestamp)}</p>
//                 </div>
//               </div>
//             </div>
//             <ConversationThread emails={selectedEmail.thread || []} />
//           </>
//         ) : (
//           <div className="flex items-center justify-center h-full text-muted-foreground">
//             Select an email to view its content
//           </div>
//         )}
//       </div>
//       <EmailComposer
//         isOpen={isComposerOpen}
//         onClose={() => setIsComposerOpen(false)}
//         to={selectedEmail?.sender}
//         replyTo={selectedEmail?.sender}
//         subject={selectedEmail?.subject}
//         mode={emailMode}
//         thread={selectedEmail?.thread || []}
//       />
//     </div>
//   )
// }

import { useState } from 'react';

export function ConversationsTable({ emails }) {
  const [selectedEmail, setSelectedEmail] = useState(null);

  return (
    <div>
      {emails.map((email) => (
        <div key={email.id} onClick={() => setSelectedEmail(email)}>
          <h3>{email.snippet}</h3>
        </div>
      ))}
      {selectedEmail && (
        <div>
          <h2>{selectedEmail.snippet}</h2>
          {/* Display more details of the selected email */}
        </div>
      )}
    </div>
  );
}