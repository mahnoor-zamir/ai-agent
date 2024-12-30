"use client";

import { useState, useEffect } from 'react';
import { Search, Star, AlertCircle, MoreHorizontal, Mail, Reply, ReplyAll, Forward } from 'lucide-react';
import { format } from 'date-fns';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { EmailComposer } from "@/components/email-composer";

interface Email {
  id: string;
  threadId?: string;
  labelIds?: string[];
  snippet: string;
  payload?: {
    headers: Array<{
      name: string;
      value: string;
    }>;
  };
  internalDate?: string;
  createdDateTime?: string;
  receivedDateTime?: string;
  subject?: string;
  bodyPreview?: string;
  from?: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
}

interface EmailDisplayProps {
  emails: Email[];
  source: 'gmail' | 'outlook';
}

export function ConversationsTable({ emails, source }: EmailDisplayProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [emailMode, setEmailMode] = useState<'new' | 'reply' | 'replyAll' | 'forward'>('new');

  const getSender = (email: Email) => {
    if (source === 'gmail' && email.payload) {
      const from = email.payload.headers.find(h => h.name.toLowerCase() === 'from');
      return from ? from.value.split('<')[0].trim() : 'Unknown Sender';
    } else if (source === 'outlook' && email.from) {
      return email.from.emailAddress.name;
    }
    return 'Unknown Sender';
  };

  const getSubject = (email: Email) => {
    if (source === 'gmail' && email.payload) {
      const subject = email.payload.headers.find(h => h.name.toLowerCase() === 'subject');
      return subject ? subject.value : 'No Subject';
    } else if (source === 'outlook' && email.subject) {
      return email.subject;
    }
    return 'No Subject';
  };

  const getSenderEmail = (email: Email) => {
    if (source === 'gmail' && email.payload) {
      const from = email.payload.headers.find(h => h.name.toLowerCase() === 'from');
      const matches = from?.value.match(/<(.+?)>/);
      return matches ? matches[1] : from?.value || '';
    } else if (source === 'outlook' && email.from) {
      return email.from.emailAddress.address;
    }
    return '';
  };

  const formatDate = (dateString: string) => {
    let date;
    if (source === 'gmail') {
      date = new Date(parseInt(dateString));
    } else {
      date = new Date(dateString);
    }
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const handleNewEmail = () => {
    setEmailMode('new');
    setIsComposerOpen(true);
  };

  const handleEmailAction = (action: 'reply' | 'replyAll' | 'forward') => {
    if (selectedEmail) {
      setEmailMode(action);
      setIsComposerOpen(true);
    }
  };

  const filteredEmails = emails.filter(email => 
    (email.snippet?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    getSender(email).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getSubject(email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background rounded-lg border">
      {/* Email List Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b space-y-4">
          <Button className="w-full" onClick={handleNewEmail}>
            <Mail className="mr-2 h-4 w-4" /> Compose
          </Button>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`p-4 border-b hover:bg-accent cursor-pointer ${
                selectedEmail?.id === email.id ? 'bg-accent' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold truncate">{getSender(email)}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formatDate(email.internalDate || email.receivedDateTime || '')}
                </span>
              </div>
              <h4 className="font-medium text-sm truncate mb-1">
                {getSubject(email)}
              </h4>
              <p className="text-sm text-muted-foreground truncate">
                {email.snippet || email.bodyPreview}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {email.labelIds?.map((label) => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label.replace('CATEGORY_', '')}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Email Content Panel */}
      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <>
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{getSubject(selectedEmail)}</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEmailAction('reply')}>
                    <Reply className="mr-2 h-4 w-4" /> Reply
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEmailAction('replyAll')}>
                    <ReplyAll className="mr-2 h-4 w-4" /> Reply All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEmailAction('forward')}>
                    <Forward className="mr-2 h-4 w-4" /> Forward
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" /> Star
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlertCircle className="mr-2 h-4 w-4" /> Mark as important
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{getSender(selectedEmail)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedEmail.internalDate || selectedEmail.receivedDateTime || '')}
                  </p>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="prose max-w-none">
                {selectedEmail.snippet || selectedEmail.bodyPreview}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select an email to view its content
          </div>
        )}
      </div>

      <EmailComposer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        to={selectedEmail ? getSenderEmail(selectedEmail) : ''}
        replyTo={selectedEmail ? getSenderEmail(selectedEmail) : ''}
        subject={selectedEmail ? getSubject(selectedEmail) : ''}
        mode={emailMode}
        thread={[]} // Note: You'll need to implement thread handling based on your needs
      />
    </div>
  );
}