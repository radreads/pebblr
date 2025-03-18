"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TimeControls } from "@/app/components/debug/TimeControls"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

interface Contact {
  id: string
  name: string
  frequency: string
  daysOverdue: number
  notes: string
  birthday?: string | Date | null
  next_reminder_date: string
  user_id: string
}

export default function DebugPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [allContacts, setAllContacts] = useState<Contact[]>([])
  const [overdueContacts, setOverdueContacts] = useState<Contact[]>([])
  const [upcomingContacts, setUpcomingContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
      toast.error('Please log in to access the debug page')
    }
  }, [user, loading, router])

  // Fetch all contacts
  const fetchAllContacts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/contacts/all')
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch contacts')
      }
      const data = await response.json()
      setAllContacts(data)
      
      // Calculate which contacts would be overdue with the current debug date
      calculateOverdueContacts(data, currentDate)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch contacts')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate which contacts are overdue based on the current debug date
  const calculateOverdueContacts = (contacts: Contact[], date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    
    const overdue = contacts.filter(contact => {
      return contact.next_reminder_date <= dateStr
    })
    
    const upcoming = contacts.filter(contact => {
      return contact.next_reminder_date > dateStr
    })
    
    // Sort by next_reminder_date
    overdue.sort((a, b) => new Date(a.next_reminder_date).getTime() - new Date(b.next_reminder_date).getTime())
    upcoming.sort((a, b) => new Date(a.next_reminder_date).getTime() - new Date(b.next_reminder_date).getTime())
    
    setOverdueContacts(overdue)
    setUpcomingContacts(upcoming)
  }

  // Handle date change from TimeControls
  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate)
    calculateOverdueContacts(allContacts, newDate)
  }

  // Fetch contacts when the component mounts
  useEffect(() => {
    if (user) {
      fetchAllContacts()
    }
  }, [user])

  // Add a function to handle marking a contact as done
  const handleMarkAsDone = async (contactId: string, contactName: string) => {
    try {
      setIsLoading(true)
      
      // Format the debug date for the interaction
      const debugFormattedDate = currentDate.toISOString().split('T')[0];
      
      // Call the API to save the interaction and update the contact's next reminder date
      const response = await fetch('/api/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          contactId: contactId,
          summary: `Test interaction from debug page at ${debugFormattedDate}`,
          interaction_date: debugFormattedDate // Pass the debug date
        }),
      });

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to mark contact as done')
      }

      toast.success(`Marked ${contactName} as done!`)
      
      // Refresh contacts after successful interaction
      await fetchAllContacts()
    } catch (error) {
      console.error('Error marking contact as done:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to mark contact as done')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Debug: Contact Reminders</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Overdue Contacts</span>
              <Badge variant="destructive" className="ml-2">{overdueContacts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdueContacts.length === 0 ? (
              <p className="text-gray-500">No overdue contacts for the current date.</p>
            ) : (
              <div className="space-y-4">
                {overdueContacts.map(contact => (
                  <div key={contact.id} className="border rounded-lg p-3 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-gray-500">Due: {new Date(contact.next_reminder_date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">Frequency: {contact.frequency}</div>
                      </div>
                      <Badge variant="destructive">
                        {getDaysOverdue(contact.next_reminder_date, currentDate)} days overdue
                      </Badge>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleMarkAsDone(contact.id, contact.name)}
                        disabled={isLoading}
                      >
                        Mark as Done
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Contacts</span>
              <Badge variant="secondary" className="ml-2">{upcomingContacts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingContacts.length === 0 ? (
              <p className="text-gray-500">No upcoming contacts.</p>
            ) : (
              <div className="space-y-4">
                {upcomingContacts.map(contact => (
                  <div key={contact.id} className="border rounded-lg p-3 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-gray-500">Due: {new Date(contact.next_reminder_date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">Frequency: {contact.frequency}</div>
                      </div>
                      <Badge variant="outline">
                        Due in {getDaysUntil(currentDate, contact.next_reminder_date)} days
                      </Badge>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleMarkAsDone(contact.id, contact.name)}
                        disabled={isLoading}
                      >
                        Mark as Done
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button onClick={fetchAllContacts} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh Contacts"}
        </Button>
      </div>
      
      <TimeControls currentDate={currentDate} onDateChange={handleDateChange} />
    </div>
  )
}

// Helper function to calculate days overdue
function getDaysOverdue(dueDate: string, currentDate: Date): number {
  const due = new Date(dueDate)
  const timeDiff = currentDate.getTime() - due.getTime()
  return Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)))
}

// Helper function to calculate days until due
function getDaysUntil(currentDate: Date, dueDate: string): number {
  const due = new Date(dueDate)
  const timeDiff = due.getTime() - currentDate.getTime()
  return Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)))
} 