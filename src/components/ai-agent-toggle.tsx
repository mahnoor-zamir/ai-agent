"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function AIAgentToggle() {
  const [isAgentActive, setIsAgentActive] = useState(true)

  const handleToggle = (checked: boolean) => {
    setIsAgentActive(checked)
    // Here you would implement the logic to actually turn the AI agent on or off
    console.log("AI Agent is now", checked ? "active" : "inactive")
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="ai-agent-mode"
        checked={isAgentActive}
        onCheckedChange={handleToggle}
        className={isAgentActive ? "data-[state=checked]:bg-green-600" : ""}
      />
      <Label 
        htmlFor="ai-agent-mode" 
      >
        AI Agent {isAgentActive ? "Active" : "Inactive"}
      </Label>
    </div>
  )
}

