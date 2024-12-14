"use client"

import { useState, useRef, useEffect } from 'react'
import { Sparkles, ArrowUp, Send, X } from 'lucide-react'
import { keyframes } from "@emotion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useChat } from 'ai/react'
import Image from 'next/image'

const pulseAnimation = keyframes`
0%, 100% { opacity: 1; }
50% { opacity: 0.5; }
`

export function WebsiteAIChat({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setInput('')
    setMessages(newMessages)

    // Simulate an API call to the AI
    const aiResponse = await new Promise<{ role: 'assistant'; content: string }>(resolve => {
      setTimeout(() => {
        resolve({
          role: 'assistant',
          content: `AI response to: "${userMessage.content}"`,
        })
      }, 1000)
    })

    setMessages([...newMessages, aiResponse])
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-[600px] flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Website AI Chat</SheetTitle>
          <SheetDescription>
            Chat with the AI to request website changes.
          </SheetDescription>
        </SheetHeader>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <ScrollArea className="flex-grow my-4" ref={scrollAreaRef}>
          <div className="space-y-4 p-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
                <div className={`group flex gap-x-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-[30px] h-[30px]">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Circle_Symbol-removebg-preview%20(1)-teJ9FE4el8jVf5gsO80juGB4nUcItu.png"
                        alt="AI"
                        width={30}
                        height={30}
                        className="rounded-sm object-contain"
                      />
                    </div>
                  )}
                  <div className={`flex flex-col flex-grow max-w-[90%] ${
                    message.role === 'user'
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-white dark:bg-gray-800'
                  } rounded-2xl px-4 py-3`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleFormSubmit} className="flex-shrink-0 mt-4 px-2 pb-2 pt-2 border-t">
          <div className="relative flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg border">
            <Input
              type="text"
              placeholder="Message AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

