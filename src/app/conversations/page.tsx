//src\app\conversations\page.tsx
"use client";

import { ConversationsTable } from "@/components/conversations-table";
import { useEffect, useState } from "react";
import ErrorBoundary from "@/components/error-boundary";

export default function ConversationsPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state

      try {
        const response = await fetch("/api/fetch-emails");

        if (!response.ok) {
          if (response.status === 401) {
            setError("You are not authorized. Please connect.");
          } else {
            setError("Failed to fetch emails. Please try again later.");
          }
          throw new Error(`Fetch failed with status ${response.status}`);
        }

        const data = await response.json();
        setEmails(data);
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchEmails();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 content-container">
        <h1 className="text-3xl font-bold">Conversations</h1>
        <p className="text-lg text-muted-foreground">Loading emails...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 content-container">
        <h1 className="text-3xl font-bold">Conversations</h1>
        <p className="text-lg text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">Conversations</h1>
        <p className="text-lg text-muted-foreground">Manage and review your AI agent's conversations</p>
      </div>
      <ErrorBoundary fallback={<div>Something went wrong in the Conversations Table.</div>}>
        <ConversationsTable emails={emails} />
      </ErrorBoundary>
    </div>
  );
}
