"use client";

import { useState } from 'react';
import { Search, Star, AlertCircle, MoreHorizontal, Mail, Reply, ReplyAll, Forward, RefreshCw, Paperclip, Archive, Trash2, AlertTriangle, Tag} from 'lucide-react';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import { decode } from 'html-entities';

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

interface EmailPart {
  mimeType: string;
  filename?: string;
  body: {
    data?: string;
    attachmentId?: string;
    size?: number;
  };
  parts?: EmailPart[];
}

interface Attachment {
  filename: string;
  mimeType: string;
  size: number;
  attachmentId: string;
}

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
    parts?: EmailPart[];
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
  source: 'gmail' | 'outlook' | null;
  refetchEmails: () => void;
}

export function ConversationsTable({ emails, source, refetchEmails }: EmailDisplayProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [emailMode, setEmailMode] = useState<'new' | 'reply' | 'replyAll' | 'forward'>('new');

  const parseGmailContent = (email: Email) => {
    const parts = email.payload?.parts || [];
    let htmlContent = '';
    let textContent = '';
    const attachments: Attachment[] = [];

    const processPart = (part: EmailPart) => {
      if (!part.mimeType) return;
      if (part.mimeType === 'text/html' && part.body.data) {
        htmlContent = decodeEmailContent(part.body.data);
      } else if (part.mimeType === 'text/plain' && part.body.data) {
        textContent = decodeEmailContent(part.body.data);
      } else if (part.body.attachmentId) {
        attachments.push({
          filename: part.filename || 'unnamed',
          mimeType: part.mimeType,
          size: part.body.size || 0,
          attachmentId: part.body.attachmentId
        });
      }
    };

    const processMultipart = (parts: EmailPart[]) => {
      parts.forEach(part => {
        if (part.mimeType?.startsWith('multipart/')) {
          if (part.parts) processMultipart(part.parts);
        } else {
          processPart(part);
        }
      });
    };

    processMultipart(parts);
    return {
      html: sanitizeHtml(htmlContent || textContent),
      text: textContent,
      attachments
    };
  };

  const parseOutlookContent = (email: Email) => {
    return {
      html: sanitizeHtml(email.bodyPreview || ''),
      text: email.bodyPreview || '',
      attachments: []
    };
  };

  const getEmailContent = (email: Email) => {
    if (source === 'gmail') {
      return parseGmailContent(email);
    } else if (source === 'outlook') {
      return parseOutlookContent(email);
    }
    return { html: '', text: '', attachments: [] };
  };

  const decodeEmailContent = (encoded: string): string => {
    try {
      const decoded = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
      return decode(decoded);
    } catch (error) {
      console.error('Error decoding email content:', error);
      return '';
    }
  };

  const sanitizeHtml = (html: string): string => {
    const sanitized = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'div', 'span', 'a', 'img', 'ul', 'ol', 'li',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote',
        'b', 'i', 'strong', 'em', 'strike', 'code', 'pre',
        'table', 'thead', 'tbody', 'tr', 'td', 'th'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target'],
      ALLOW_DATA_ATTR: false,
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['frameborder', 'allowfullscreen']
    });
    return `
      <div class="email-content">
        ${sanitized}
      </div>
    `;
  };

  // Rest of the helper functions remain the same
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

  if (!source) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Connect to a provider to view emails
      </div>
    );
  }

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
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b space-y-4">
          <div className="flex justify-between items-center">
            <Button className="w-full" onClick={handleNewEmail}>
              <Mail className="mr-2 h-4 w-4" /> Compose
            </Button>
            <Button variant="outline" size="icon" onClick={refetchEmails}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
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

      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <>
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{getSubject(selectedEmail)}</h2>
                {/* <div className="flex gap-2">
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
                </div> */}
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
                      <DropdownMenuItem>
                        <Archive className="h-4 w-4" /> Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlertTriangle className="h-4 w-4" /> Mark as spam
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Tag className="h-4 w-4" /> Label
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
              {(() => {
                const { html, attachments } = getEmailContent(selectedEmail);
                return (
                  <div>
                    {attachments.length > 0 && (
                      <div className="mb-4 p-4 border rounded-lg">
                        <h3 className="font-medium mb-2 flex items-center">
                          <Paperclip className="mr-2 h-4 w-4" /> Attachments
                        </h3>
                        <div className="space-y-2">
                          {attachments.map((attachment) => (
                            <div key={attachment.attachmentId} className="flex items-center">
                              <span className="text-sm">{attachment.filename}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({Math.round(attachment.size / 1024)}KB)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  </div>
                );
              })()}
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
        thread={[]}
      />
    </div>
  );
}