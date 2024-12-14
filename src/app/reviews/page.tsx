"use client"
import { Star } from 'lucide-react'

import { useState, useEffect } from 'react'
import { DropletsIcon as ChatTeardropDots } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Toast } from "@/components/ui/toast"

interface Review {
  //added place holder for reply content
  id: string
  author: string
  rating: number
  text: string
  time: string
  replied?: boolean
}

export default function ReviewsPage() {
  const [profile, setProfile] = useState<any | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [reply, setReply] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [aiReviewReply, setAiReviewReply] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest'>('newest') // Added sortBy state
  const [apiKey, setApiKey] = useState(process.env.GOOGLE_BUSINESS_PROFILE_API_KEY || null)

  useEffect(() => {
    setApiKey(process.env.GOOGLE_BUSINESS_PROFILE_API_KEY || null)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const profileName = (document.getElementById('profileName') as HTMLInputElement)?.value
    if (!profileName) return

    try {
      const response = await fetch(`/api/google-business-profile?profileName=${profileName}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      })
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch profile')
        return
      }
      const data = await response.json()
      setProfile(data.profile)
      setReviews(data.reviews)
      setError(null)
    } catch (error) {
      setError('An error occurred while searching for your profile.')
      console.error(error)
    }
  }

  const handleReply = async () => {
    if (!selectedReview || !reply) return
    setIsReplying(true)
    try {
      // Simulate sending a reply
      await new Promise(resolve => setTimeout(resolve, 1000))
      setReviews(reviews.map(review =>
        review.id === selectedReview.id ? { ...review, replied: true } : review
      ))
      setSelectedReview(null)
      setReply('')
      toast({
        title: 'Reply sent!',
        description: 'Your reply has been sent successfully.',
      })
    } catch (error) {
      Toast({
        title: 'Error sending reply',
        description: 'There was an error sending your reply. Please try again.',
        variant: 'destructive',
      })
      console.error(error)
    } finally {
      setIsReplying(false)
    }
  }

  // Added sorting logic
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.time).getTime() - new Date(a.time).getTime()
    } else if (sortBy === 'oldest') {
      return new Date(a.time).getTime() - new Date(b.time).getTime()
    } else {
      return b.rating - a.rating
    }
  })

  const handleSortByChange = (value: 'newest' | 'oldest' | 'highest') => {
    setSortBy(value)
  }

  const getStarColor = (rating: number) => {
    if (rating >= 4) return 'text-yellow-500'
    if (rating >= 2) return 'text-yellow-300'
    return 'text-yellow-100'
  }

  const handleToggleAIReply = () => {
    setAiReviewReply(!aiReviewReply)
    // Implement logic to turn AI review reply on/off
    console.log(`AI review reply is now ${!aiReviewReply ? 'on' : 'off'}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-lg text-muted-foreground">Manage your Google Business Profile reviews</p>
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Find Your Profile</CardTitle>
          <CardDescription>Enter your Google Business Profile name to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Select value={sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
              </SelectContent>
            </Select>
            <span className="flex items-center space-x-2">
              <Switch
                checked={aiReviewReply}
                onCheckedChange={handleToggleAIReply}
                className={`${aiReviewReply ? 'bg-green-500' : 'bg-gray-200'} transition-colors`}
              />
              <Label htmlFor="ai-review-reply" className="cursor-pointer">
                AI Review Reply
              </Label>
            </span>
          </div>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profileName">Google Business Profile Name</Label>
              <Input id="profileName" placeholder="e.g., Your Business Name" />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>{profile.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Select value={sortBy} onValueChange={handleSortByChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest">Highest Rating</SelectItem>
                </SelectContent>
              </Select>
              <span className="flex items-center space-x-2">
                <Switch
                  checked={aiReviewReply}
                  onCheckedChange={handleToggleAIReply}
                  className={`${aiReviewReply ? 'bg-green-500' : 'bg-gray-200'} transition-colors`}
                />
                <Label htmlFor="ai-review-reply" className="cursor-pointer">
                  AI Review Reply
                </Label>
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Reply</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.author}</TableCell>
                    <TableCell><span className={getStarColor(review.rating)}><Star className="h-4 w-4 inline-block mr-1 align-text-bottom" />{review.rating}</span></TableCell>
                    <TableCell className="max-w-[300px] truncate">{review.text}</TableCell>
                    <TableCell>{review.time}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReview(review)}
                      >
                        Reply
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Sheet open={selectedReview !== null} onOpenChange={() => setSelectedReview(null)}>
        <SheetContent className="p-0 sm:max-w-[600px]">
          <SheetHeader className="border-b px-6 pt-6 pb-4">
            <SheetTitle>Reply to Review</SheetTitle>
            <SheetDescription>
              Reply to {selectedReview?.author}'s review
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{selectedReview?.text}</p>
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 py-4 space-y-4">
            <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{selectedReview?.text}</p>
            <div className="space-y-2">
              <Label htmlFor="reply">Reply</Label>
              <Textarea
                id="reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={5}
                className="min-h-[150px]"
              />
            </div>
          </div>
          <SheetFooter className="px-6 py-4 bg-muted">
            <SheetClose asChild>
              <Button variant="outline" onClick={() => {
                setSelectedReview(null)
                setReply('')
              }}>Cancel</Button>
            </SheetClose>
            <Button onClick={handleReply} disabled={!reply || isReplying}>
              {isReplying ? 'Sending...' : 'Send Reply'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

