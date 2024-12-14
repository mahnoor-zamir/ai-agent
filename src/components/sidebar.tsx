"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, BookOpen, Settings, ChevronRight, ChevronLeft, User, LogOut, Calendar, Globe, BarChart, LineChart, Send, Star } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const menuItems = [
  { icon: Home, label: 'Home', href: '/', tooltip: 'Dashboard overview' },
  { icon: MessageSquare, label: 'Conversations', href: '/conversations', tooltip: 'Manage conversations' },
  { icon: Calendar, label: 'Calendar', href: '/calendar', tooltip: 'View and manage appointments' },
  {
    icon: Star,
    label: "Reviews",
    href: "/reviews",
    tooltip: "Manage Google Business Profile reviews"
  },
  {
    icon: BarChart,
    label: 'Marketing',
    href: '/marketing',
    tooltip: 'Manage marketing campaigns',
    subItems: [
      { label: 'Google Ads', href: '/marketing/google-ads', tooltip: 'Manage Google Ads campaigns' },
      { label: 'Meta Ads', href: '/marketing/meta-ads', tooltip: 'Manage Meta Ads campaigns' },
      { label: 'Google Analytics', href: '/marketing/google-analytics', tooltip: 'View Google Analytics data' },
    ]
  },
  {
    icon: Send,
    label: 'Campaigns',
    href: '/campaigns',
    tooltip: 'Manage email and SMS campaigns',
    subItems: [
      { label: 'Activity', href: '/campaigns/activity', tooltip: 'View campaign activity' },
      { label: 'Automations', href: '/campaigns/automations', tooltip: 'Configure campaign automations' },
      { label: 'Blasts', href: '/campaigns/blasts', tooltip: 'Send bulk messages' },
    ]
  },
  { 
    icon: Globe, 
    label: 'Website', 
    href: '/website', 
    tooltip: 'Manage website content',
    subItems: [
      { label: 'WordPress Editor', href: '/website/wordpress-editor', tooltip: 'Edit WordPress content' },
    ]
  },
  { icon: Settings, label: 'Settings', href: '/settings', tooltip: 'Configure application settings' },
]

const user = {
  name: "John Doe",
  email: "john@example.com",
};

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const toggleExpand = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label)
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "flex flex-col h-screen border-r border-gray-200 bg-[#FAFAFA] text-[#18181b] transition-all duration-300",
        isCollapsed ? "w-[64px]" : "w-64"
      )}>
        <div className="flex items-center justify-center h-18 border-b border-gray-200 dark:border-gray-800 py-3">
          <div className="flex items-center justify-center w-18 h-18">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Circle_Symbol-removebg-preview%20(1)-teJ9FE4el8jVf5gsO80juGB4nUcItu.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="flex flex-col gap-2 px-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.subItems && item.subItems.some(subItem => pathname === subItem.href))
              return (
                <li key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                            "hover:bg-gray-200",
                            isActive ? "bg-gray-200 font-medium" : "text-[#18181b]",
                            isCollapsed && "justify-center"
                          )}
                          onClick={(e) => {
                            if (item.subItems) {
                              e.preventDefault()
                              toggleExpand(item.label)
                            }
                          }}
                        >
                          <item.icon className={cn("flex-shrink-0", isCollapsed ? "h-5 w-5" : "h-4 w-4")} />
                          {!isCollapsed && <span>{item.label}</span>}
                          {!isCollapsed && item.subItems && (
                            <ChevronRight className={cn("ml-auto h-4 w-4 transition-transform", expandedItem === item.label && "rotate-90")} />
                          )}
                        </Link>
                        {!isCollapsed && item.subItems && expandedItem === item.label && (
                          <ul className="ml-6 mt-2 space-y-2">
                            {item.subItems.map((subItem) => (
                              <li key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  className={cn(
                                    "block rounded-md px-3 py-2 text-sm transition-colors",
                                    "hover:bg-gray-200",
                                    pathname === subItem.href ? "bg-gray-200 font-medium" : "text-[#18181b]"
                                  )}
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full h-8 flex items-center justify-center text-[#18181b] hover:bg-gray-200"
              >
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="py-3 border-t border-gray-200 dark:border-gray-800">
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start px-2 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10 rounded-md bg-gray-300 flex-shrink-0">
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {!isCollapsed && (
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-medium text-[#18181b]">{user.name}</span>
                          <span className="text-xs text-gray-500">{user.email}</span>
                        </div>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>User profile and options</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}

