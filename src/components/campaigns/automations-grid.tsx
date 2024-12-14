import { useState } from 'react'
import { MessageSquare, Star, HelpCircle } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { RequestAutomationModal } from "./request-automation-modal"
import { ReviewRequestModal } from "./review-request-modal"
import { PostTourModal } from "./post-tour-modal"

type AutomationId = "post_tour" | "review_request";

const automations = [
  {
    id: "post_tour",
    title: "Post-Tour Message",
    description: "Send a personalized follow-up message after a tour",
    icon: MessageSquare,
    color: "bg-blue-100",
  },
  {
    id: "review_request",
    title: "Review Request",
    description: "Ask customers for reviews after their event",
    icon: Star,
    color: "bg-yellow-100",
    configurable: true,
  },
  {
    id: "custom",
    title: "Need more?",
    description: "Request a custom automation from VenueX",
    icon: HelpCircle,
    color: "bg-purple-100",
    isSpecial: true,
  }
];

export function AutomationsGrid() {
  const [activeAutomations, setActiveAutomations] = useState<Record<AutomationId, boolean>>({
    post_tour: false,
    review_request: false,
  });

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isReviewRequestModalOpen, setIsReviewRequestModalOpen] = useState(false);
  const [isPostTourModalOpen, setIsPostTourModalOpen] = useState(false);

  const toggleAutomation = (id: AutomationId) => {
    setActiveAutomations(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {automations.map((automation) => (
          <Card
            key={automation.id}
            className={`relative overflow-hidden ${automation.isSpecial ? 'border-dashed' : ''} flex flex-col`}
          >
            <CardContent className="p-6 flex flex-col flex-grow">
              <div className="flex items-start space-x-4 mb-4">
                <div className={`${automation.color} p-2 rounded-lg`}>
                  <automation.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1 flex-grow">
                  <h3 className="font-medium">{automation.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {automation.description}
                  </p>
                </div>
                {!automation.isSpecial && (
                  <Switch
                    checked={activeAutomations[automation.id as AutomationId]}
                    onCheckedChange={() => toggleAutomation(automation.id as AutomationId)}
                    className="data-[state=checked]:bg-green-600"
                  />
                )}
              </div>
              {(automation.id === 'review_request' || automation.id === 'post_tour' || automation.isSpecial) && (
                <div className="mt-auto">
                  <Button
                    variant="default"
                    className="w-full rounded-md bg-black text-white py-2 px-4 hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      if (automation.id === 'review_request') {
                        setIsReviewRequestModalOpen(true);
                      } else if (automation.id === 'post_tour') {
                        setIsPostTourModalOpen(true);
                      } else if (automation.isSpecial) {
                        setIsRequestModalOpen(true);
                      }
                    }}
                  >
                    {automation.id === 'custom' ? 'Send Request' : 'Configure'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <RequestAutomationModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
      <ReviewRequestModal
        isOpen={isReviewRequestModalOpen}
        onClose={() => setIsReviewRequestModalOpen(false)}
        onSave={(timing, message, styles) => {
          console.log("Review request configuration:", { timing, message, styles });
          setIsReviewRequestModalOpen(false);
        }}
      />
      <PostTourModal
        isOpen={isPostTourModalOpen}
        onClose={() => setIsPostTourModalOpen(false)}
        onSave={(timing, message, styles) => {
          console.log("Post-tour message configuration:", { timing, message, styles });
          setIsPostTourModalOpen(false);
        }}
      />
    </div>
  );
}
