"use client";

import { ConversationsTable } from "@/components/conversations-table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ConversationsPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  const [source, setSource] = useState<'gmail' | 'outlook' | null>(null); // Track selected source
  const [connections, setConnections] = useState({
    gmail: false,
    outlook: false,
  });

  const fetchEmails = async (emailSource: 'gmail' | 'outlook' | null) => {
    setLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      if (!emailSource) {
        setError("No email account connected. Please connect Gmail or Outlook.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/fetch-emails", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider: emailSource }),
      });

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

  useEffect(() => {
    const checkStatus = async () => {
      const response = await fetch("/api/checkAuthStatus");
      const data = await response.json();
      setConnections(data);

      if (!data.gmail && !data.outlook) {
        setSource(null);
      } else if (data.gmail) {
        setSource('gmail');
      } else if (data.outlook) {
        setSource('outlook');
      }
    };

    checkStatus();
  }, []);

  useEffect(() => {
    if (source) {
      fetchEmails(source);
    }
  }, [source]);

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
      <ConversationsTable emails={emails} source={source} refetchEmails={() => fetchEmails(source)} />
    </div>
  );
}