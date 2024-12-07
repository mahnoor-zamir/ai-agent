"use client"

import { useState, useCallback } from 'react'
import { Upload, PlusCircle, X, FileText } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Knowledgebase() {
  const [documents, setDocuments] = useState<File[]>([])
  const [freeText, setFreeText] = useState('')
  const [questions, setQuestions] = useState<string[]>([''])
  const [answers, setAnswers] = useState<string[]>([''])
  const [instructions, setInstructions] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDocuments(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddQA = () => {
    setQuestions([...questions, ''])
    setAnswers([...answers, ''])
  }

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index] = value
    setQuestions(newQuestions)
  }

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledgebase</CardTitle>
        <CardDescription>Adjust the content used to train the AI</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="freetext">Text</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
            <TabsTrigger value="instructions">AI Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="documents">
            <div className="flex flex-col gap-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag 'n' drop some files here, or click to select files
                </p>
              </div>
              {documents && documents.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 font-medium">Uploaded Documents:</h4>
                  <ul className="space-y-2">
                    {documents.map((doc, index) => (
                      <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <span className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
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
              {questions && questions.length > 0 ? (
                questions.map((question, index) => (
                  <div key={index} className="grid gap-2">
                    <Input
                      placeholder="Question"
                      value={question}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                    />
                    <Textarea
                      placeholder="Answer"
                      value={answers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                    />
                  </div>
                ))
              ) : (
                <p>No questions added yet. Click "Add Q&A Pair" to get started.</p>
              )}
              <Button onClick={handleAddQA} variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
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
      </CardContent>
      <CardFooter>
        <Button className="ml-auto">Save Knowledgebase</Button>
      </CardFooter>
    </Card>
  )
}

