"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import { WordPressService } from "@/lib/wordpress-service"

interface WordPressEditorProps {}

export function WordPressEditor({}: WordPressEditorProps) {
  const [pages, setPages] = useState<any[]>([])
  const [selectedPage, setSelectedPage] = useState<any>(null)
  const [pageContent, setPageContent] = useState('')
  const [pageTitle, setPageTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wpService = new WordPressService()

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedPages = await wpService.getPages()
      if (Array.isArray(fetchedPages)) {
        setPages(fetchedPages)
        if (fetchedPages.length > 0) {
          await handlePageSelect(fetchedPages[0].id.toString())
        } else {
          setError('No pages found. Please create a page in your WordPress site.')
        }
      } else {
        setError('Unexpected response from WordPress. Please check your connection and try again.')
      }
    } catch (err) {
      console.error('Error details:', err)
      setError('Failed to fetch pages. Please check your WordPress connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageSelect = async (pageId: string) => {
    if (!pageId) {
      setSelectedPage(null)
      setPageContent('')
      setPageTitle('')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const page = await wpService.getPage(parseInt(pageId))
      setSelectedPage(page)
      setPageTitle(page.title.rendered)
      setPageContent(page.content.rendered)
    } catch (err) {
      console.error('Error fetching page:', err)
      setError('Failed to fetch the selected page. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (selectedPage) {
      setIsLoading(true)
      setError(null)
      try {
        await wpService.updatePage(selectedPage.id, pageTitle, pageContent)
        // Alert is not ideal for UX, but included for demonstration purposes
        alert('Page updated successfully!')
      } catch (err) {
        console.error('Error updating page:', err)
        setError('Failed to update the page. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>WordPress Editor</CardTitle>
        <CardDescription>Edit your WordPress website content</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="space-y-4">
            {Array.isArray(pages) && ( // Conditionally render the Select component
              <Select onValueChange={handlePageSelect} value={selectedPage?.id.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a page to edit" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map(page => (
                    <SelectItem key={page.id} value={page.id.toString()}>
                      {page.title.rendered}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedPage && (
              <>
                <Input
                  placeholder="Page Title"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Page Content"
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  rows={10}
                />
                <div className="flex justify-end space-x-2">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          <TabsContent value="preview">
            <div className="border p-4 min-h-[300px]">
              <h1 className="text-2xl font-bold mb-4">{pageTitle}</h1>
              <div dangerouslySetInnerHTML={{ __html: pageContent }} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

