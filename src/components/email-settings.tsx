"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, FileUp, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDropzone } from "react-dropzone";
// import Cookies from 'js-cookie'
import { parse } from "cookie";
import { deleteCookie } from '@/lib/delete-cookie';

export function EmailSettings() {
  const [connectedEmail, setConnectedEmail] = useState<
    "gmail" | "outlook" | null
  >(null);
  const [initialReply, setInitialReply] = useState("");
  const [followUpTemplates, setFollowUpTemplates] = useState<
    { content: string; schedule: string }[]
  >([
    { content: "", schedule: "3" },
    { content: "", schedule: "7" },
    { content: "", schedule: "14" },
    { content: "", schedule: "30" },
  ]);
  const [emailSignature, setEmailSignature] = useState("");
  const [aiName, setAiName] = useState("");
  const [reminders, setReminders] = useState<{ id: string; days: string }[]>([
    { id: "1", days: "1" },
  ]);
  const [googleAdsConnected, setGoogleAdsConnected] = useState(false);
  const [metaAdsConnected, setMetaAdsConnected] = useState(false);
  const [googleAnalyticsConnected, setGoogleAnalyticsConnected] =
    useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [documents, setDocuments] = useState<File[]>([]);
  const [freeText, setFreeText] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [answers, setAnswers] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState("");

  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [isOutlookConnected, setIsOutlookConnected] = useState(false);
  const [connections, setConnections] = useState({
    gmail: false,
    outlook: false,
  });

  const checkStatus = async () => {
    const response = await fetch("/api/checkAuthStatus");
    const data = await response.json();
    setConnections(data);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDocuments((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddQA = () => {
    setQuestions([...questions, ""]);
    setAnswers([...answers, ""]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleConnectEmail = (provider: "gmail" | "outlook") => {
    if (provider === "gmail") {
      handleDisconnectEmail("outlook");
      window.location.href = "/api/auth/google";
    } else if (provider === "outlook") {
      handleDisconnectEmail("gmail");
      window.location.href = "/api/auth/outlook";
    }
  };

  const handleConnectMarketing = (
    platform: "google" | "meta" | "analytics"
  ) => {
    // Implement marketing platform connection logic here
    switch (platform) {
      case "google":
        setGoogleAdsConnected(true);
        break;
      case "meta":
        setMetaAdsConnected(true);
        break;
      case "analytics":
        setGoogleAnalyticsConnected(true);
        break;
    }
  };

  const handleDisconnectEmail = async (provider: "gmail" | "outlook") => {
    try {
      if (provider === "gmail") {
        deleteCookie('tokens');
        deleteCookie('isGmailConnected');
        setConnectedEmail(null);
      } else if (provider === "outlook") {
        deleteCookie('outlookTokens');
        deleteCookie('isOutlookConnected');
        setConnectedEmail(null);
      }
      checkStatus();
    } catch (error) {
      console.error('Error disconnecting email:', error);
    }
  };

  const handleUpdateSettings = () => {
    // Implement update logic here
    console.log("Updating settings:", {
      name,
      email,
      initialReply,
      followUpTemplates,
      emailSignature,
      aiName,
      reminders,
      googleAdsConnected,
      metaAdsConnected,
      googleAnalyticsConnected,
    });
  };

  const updateFollowUpTemplate = (
    index: number,
    field: keyof { content: string; schedule: string },
    value: string
  ) => {
    const newTemplates = [...followUpTemplates];
    newTemplates[index] = { ...newTemplates[index], [field]: value };
    setFollowUpTemplates(newTemplates);
  };

  const addReminder = () => {
    const newId = (reminders.length + 1).toString();
    setReminders([...reminders, { id: newId, days: "1" }]);
  };

  const updateReminder = (id: string, days: string) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, days } : reminder
      )
    );
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  return (
    <div className="space-y-8 content-container">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ai-settings">
              <AccordionTrigger>AI Settings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-name">AI Agent Name</Label>
                    <Input
                      id="ai-name"
                      placeholder="Enter AI agent name..."
                      value={aiName}
                      onChange={(e) => setAiName(e.target.value)}
                    />
                  </div>
                </div>
                <Tabs defaultValue="initial-reply" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="initial-reply">
                      Initial Reply
                    </TabsTrigger>
                    <TabsTrigger value="follow-up-1">Follow-up 1</TabsTrigger>
                    <TabsTrigger value="follow-up-2">Follow-up 2</TabsTrigger>
                    <TabsTrigger value="follow-up-3">Follow-up 3</TabsTrigger>
                    <TabsTrigger value="follow-up-4">Follow-up 4</TabsTrigger>
                  </TabsList>
                  <TabsContent value="initial-reply">
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="initial-reply">
                        Initial AI Reply Template
                      </Label>
                      <Textarea
                        id="initial-reply"
                        placeholder="Enter the initial reply template for AI..."
                        value={initialReply}
                        onChange={(e) => setInitialReply(e.target.value)}
                        rows={10}
                        className="min-h-[200px]"
                      />
                    </div>
                  </TabsContent>
                  {followUpTemplates.map((template, index) => (
                    <TabsContent key={index} value={`follow-up-${index + 1}`}>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center space-x-4">
                          <Label
                            htmlFor={`follow-up-${index + 1}-schedule`}
                            className="min-w-[100px]"
                          >
                            Send after
                          </Label>
                          <Select
                            value={template.schedule}
                            onValueChange={(value) =>
                              updateFollowUpTemplate(index, "schedule", value)
                            }
                          >
                            <SelectTrigger
                              id={`follow-up-${index + 1}-schedule`}
                              className="w-[180px]"
                            >
                              <SelectValue placeholder="Select days" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 day</SelectItem>
                              <SelectItem value="3">3 days</SelectItem>
                              <SelectItem value="7">1 week</SelectItem>
                              <SelectItem value="14">2 weeks</SelectItem>
                              <SelectItem value="30">1 month</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-muted-foreground">
                            after the previous message
                          </span>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`follow-up-${index + 1}`}>
                            Follow-up Template {index + 1}
                          </Label>
                          <Textarea
                            id={`follow-up-${index + 1}`}
                            placeholder={`Enter follow-up template ${
                              index + 1
                            }...`}
                            value={template.content}
                            onChange={(e) =>
                              updateFollowUpTemplate(
                                index,
                                "content",
                                e.target.value
                              )
                            }
                            rows={10}
                            className="min-h-[200px]"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
                <div className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">AI Knowledgebase</h2>
                    <Tabs defaultValue="documents" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="freetext">Text</TabsTrigger>
                        <TabsTrigger value="qa">Q&A</TabsTrigger>
                        <TabsTrigger value="instructions">
                          AI Instructions
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="documents">
                        <div className="flex flex-col gap-4">
                          <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
                              isDragActive
                                ? "border-primary bg-primary/10"
                                : "border-muted-foreground"
                            }`}
                          >
                            <input {...getInputProps()} />
                            <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Drag 'n' drop some files here, or click to select
                              files
                            </p>
                          </div>
                          {documents && documents.length > 0 && (
                            <div className="mt-4">
                              <h4 className="mb-2 font-medium">
                                Uploaded Documents:
                              </h4>
                              <ul className="space-y-2">
                                {documents.map((doc, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                                  >
                                    <span className="flex items-center">
                                      <FileUp className="mr-2 h-4 w-4" />
                                      {doc.name}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeDocument(index)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      <TabsContent value="freetext">
                        <Textarea
                          placeholder="Enter any additional information or context here..."
                          value={freeText}
                          onChange={(e) => setFreeText(e.target.value)}
                          className="min-h-[200px]"
                        />
                      </TabsContent>
                      <TabsContent value="qa">
                        <div className="space-y-4">
                          {questions.map((question, index) => (
                            <div key={index} className="grid gap-2">
                              <Input
                                placeholder="Question"
                                value={question}
                                onChange={(e) =>
                                  handleQuestionChange(index, e.target.value)
                                }
                              />
                              <Textarea
                                placeholder="Answer"
                                value={answers[index] || ""}
                                onChange={(e) =>
                                  handleAnswerChange(index, e.target.value)
                                }
                              />
                            </div>
                          ))}
                          <Button onClick={handleAddQA} variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Q&A Pair
                          </Button>
                        </div>
                      </TabsContent>
                      <TabsContent value="instructions">
                        <Textarea
                          placeholder="Enter specific AI instructions here..."
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          className="min-h-[200px]"
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="profile-settings">
              <AccordionTrigger>Profile Settings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Avatar className="h-24 w-24 rounded-md">
                      <AvatarImage
                        src="/placeholder.svg?height=100&width=100"
                        alt={name}
                      />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button>Change Avatar</Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="appointment-settings">
              <AccordionTrigger>Appointment Settings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Label>Appointment Reminders</Label>
                  <div className="space-y-2">
                    {reminders.map((reminder, index) => (
                      <div
                        key={reminder.id}
                        className="flex items-center space-x-2"
                      >
                        <Select
                          value={reminder.days}
                          onValueChange={(value) =>
                            updateReminder(reminder.id, value)
                          }
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select days before" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day before</SelectItem>
                            <SelectItem value="2">2 days before</SelectItem>
                            <SelectItem value="3">3 days before</SelectItem>
                            <SelectItem value="7">1 week before</SelectItem>
                          </SelectContent>
                        </Select>
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeReminder(reminder.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addReminder}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Reminder
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="email-accounts">
              <AccordionTrigger>Email Settings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Gmail</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect your Gmail account
                      </p>
                    </div>
                    {connections.gmail ? (
                      <div className="space-x-2">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Connected
                        </Badge>
                        <Button onClick={() => handleDisconnectEmail("gmail")}>
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <div className="space-x-2">
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800"
                        >
                          Not Connected
                        </Badge>
                        <Button onClick={() => handleConnectEmail("gmail")}>
                          Connect
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Outlook</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect your Outlook account
                      </p>
                    </div>
                    {connections.outlook ? (
                      <div className="space-x-2">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Connected
                        </Badge>
                        <Button onClick={() => handleDisconnectEmail("outlook")}>
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <div className="space-x-2">
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800"
                        >
                          Not Connected
                        </Badge>
                        <Button onClick={() => handleConnectEmail("outlook")}>
                          Connect
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="email-signature">Email Signature</Label>
                    <Textarea
                      id="email-signature"
                      placeholder="Enter your email signature..."
                      value={emailSignature}
                      onChange={(e) => setEmailSignature(e.target.value)}
                      rows={5}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="marketing-settings">
              <AccordionTrigger>Marketing Settings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Google Ads</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect your Google Ads account
                      </p>
                    </div>
                    {googleAdsConnected ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Connected
                      </Badge>
                    ) : (
                      <div className="space-x-2">
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800"
                        >
                          Not Connected
                        </Badge>
                        <Button
                          onClick={() => handleConnectMarketing("google")}
                        >
                          Connect Google Ads
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Meta Ads</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect your Meta Ads account
                      </p>
                    </div>
                    {metaAdsConnected ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Connected
                      </Badge>
                    ) : (
                      <div className="space-x-2">
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800"
                        >
                          Not Connected
                        </Badge>
                        <Button onClick={() => handleConnectMarketing("meta")}>
                          Connect Meta Ads
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Google Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect your Google Analytics account
                      </p>
                    </div>
                    {googleAnalyticsConnected ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Connected
                      </Badge>
                    ) : (
                      <div className="space-x-2">
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800"
                        >
                          Not Connected
                        </Badge>
                        <Button
                          onClick={() => handleConnectMarketing("analytics")}
                        >
                          Connect Google Analytics
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleUpdateSettings} size="lg">
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
