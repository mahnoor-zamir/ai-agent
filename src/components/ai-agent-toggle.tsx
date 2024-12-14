"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AIAgentToggle() {
  const [isAgentActive, setIsAgentActive] = useState(true)

  const handleToggle = (checked: boolean) => {
    setIsAgentActive(checked)
    // Here you would implement the logic to actually turn the AI agent on or off
    console.log("AI Agent is now", checked ? "active" : "inactive")
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            <Switch
              id="ai-agent-mode"
              checked={isAgentActive}
              onCheckedChange={handleToggle}
              className={`${isAgentActive ? "bg-green-500" : "bg-gray-200"} transition-colors`}
            />
            <Label htmlFor="ai-agent-mode" className="text-sm font-medium cursor-pointer">
              {isAgentActive ? "AI Agent Active" : "AI Agent Inactive"}
            </Label>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isAgentActive ? "Deactivate AI Agent" : "Activate AI Agent"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

