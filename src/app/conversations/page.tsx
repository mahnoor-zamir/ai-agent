"use client"
import { ConversationsTable } from "@/components/conversations-table"
import { useEffect, useState } from 'react';
import ErrorBoundary from "@/components/error-boundary"

export default function ConversationsPage() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch('/api/fetch-emails');
        if (!response.ok) {
          throw new Error('Failed to fetch emails');
        }
        const data = await response.json();
        setEmails(data);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">Conversations</h1>
        <p className="text-lg text-muted-foreground">Manage and review your AI agent's conversations</p>
      </div>
      <ErrorBoundary fallback={<div>Something went wrong in the Conversations Table.</div>}>
        <ConversationsTable  emails={emails} />
      </ErrorBoundary>
    </div>
  )
}

