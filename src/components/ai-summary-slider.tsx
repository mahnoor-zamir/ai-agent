import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { X, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface LeadScore {
  total: number
  breakdown: {
    [key: string]: number
  }
}

interface AISummarySliderProps {
  isOpen: boolean
  onClose: () => void
  leadName: string
  summary: string
  leadScore?: LeadScore
}

export function AISummarySlider({ isOpen, onClose, leadName, summary, leadScore }: AISummarySliderProps) {
  const formatSummary = (summary: string) => {
    if (!summary) return null;
    const sections = summary.trim().split('\n\n');
    return sections.map((section, index) => {
      const [title, ...content] = section.split('\n');
      return (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-bold mb-2">{title.trim()}</h3>
          <div className="space-y-1">
            {content.map((item, itemIndex) => (
              <p key={itemIndex}>{item.trim()}</p>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="space-y-2 pr-10">
          <SheetTitle className="flex items-center text-2xl font-bold">
            <Sparkles className="w-6 h-6 mr-2 text-[#0042af]" />
            AI Summary for {leadName}
          </SheetTitle>
          <SheetDescription>
            A comprehensive overview of interactions and insights
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
        <ScrollArea className="h-[calc(100vh-200px)] mt-6 pr-4">
          {leadScore && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Lead Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Score:</span>
                    <span className="font-bold">{leadScore.total}</span>
                  </div>
                  <Progress value={leadScore.total} className="w-full" />
                  <div className="space-y-2">
                    {Object.entries(leadScore.breakdown).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm">{key}:</span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="border-gray-200 bg-background">
            <CardContent className="p-6">
              {formatSummary(summary) || <p>No summary available.</p>}
            </CardContent>
          </Card>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

