import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { AIAgentToggle } from "@/components/ai-agent-toggle";

import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { NotificationBell } from "@/components/notification-bell";
import { AskAIAnything } from "@/components/ask-ai-anything";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Sales Agent Dashboard",
  description: "Track your AI agent's performance and follow-up metrics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-900">
            <div className="flex-shrink-0 h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
              <div className="flex items-center flex-1">
                <div className="flex-1 mr-4">
                  <AskAIAnything />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <AIAgentToggle />
                <NotificationBell />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8">{children}</div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
