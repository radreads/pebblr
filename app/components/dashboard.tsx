"use client"

import { useState, useEffect } from "react"
import { Bell, Check, ChevronDown, Gift, Plus, Search, Settings, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { TimeControls } from "@/app/components/debug/TimeControls"
import { InteractionModal } from "@/components/interaction-modal"
import { TableChecker } from "@/app/components/debug/TableChecker"
import { AddSummaryColumn } from "@/app/components/debug/AddSummaryColumn"

interface Contact {
  id: string
  name: string
  frequency: string
  daysOverdue: number
  notes: string
  birthday?: string | Date | null
  next_reminder_date?: string | Date | null
  user_id: string
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [contactsList, setContactsList] = useState<Contact[]>([])
  const [isPulsing, setIsPulsing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingContact, setEditingContact] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newContact, setNewContact] = useState({
    name: "",
    frequency: "monthly",
    notes: "",
    birthday: undefined as Date | undefined,
  })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false)
  const [interactingContact, setInteractingContact] = useState<Contact | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
      toast.error('Please log in to access the dashboard')
    }
  }, [user, loading, router])

  // Add a pulsing effect every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true)
      setTimeout(() => setIsPulsing(false), 1000)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Add function to fetch contacts
  const fetchContacts = async (date: Date) => {
    try {
      const response = await fetch(`/api/contacts?currentDate=${date.toISOString()}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch contacts')
      }
      const data = await response.json()
      setContactsList(data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch contacts')
      
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/')
      }
    }
  }

  // Fetch contacts on mount and when date changes
  useEffect(() => {
    if (user) {
      fetchContacts(currentDate)
    }
  }, [user, currentDate])

  // Update handleDateChange to use the new date
  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate)
  }

  // Update handleAddContact to refresh contacts after adding
  const handleAddContact = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newContact.name,
          frequency: newContact.frequency,
          notes: newContact.notes,
          birthday: newContact.birthday?.toISOString().split('T')[0],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add contact')
      }

      // Refresh contacts list
      await fetchContacts(currentDate)

      // Reset the form
      setNewContact({
        name: "",
        frequency: "monthly",
        notes: "",
        birthday: undefined,
      })

      // Close the modal
      setIsModalOpen(false)
      toast.success('Contact added successfully!')
    } catch (error) {
      console.error('Error adding contact:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add contact')
      
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Update markAsDone to open the interaction modal
  const markAsDone = async (id: string) => {
    const contact = contactsList.find((c) => c.id === id)
    if (contact) {
      setInteractingContact(contact)
      setIsInteractionModalOpen(true)
    }
  }

  // Add a function to handle saving the interaction
  const handleSaveInteraction = async (summary: string) => {
    try {
      if (!interactingContact) {
        toast.error("Contact information is missing");
        return;
      }
      
      console.log('Saving interaction for contact:', interactingContact.name, 'with ID:', interactingContact.id);
      
      // Validate IDs before sending to API
      if (!interactingContact.id || typeof interactingContact.id !== 'string') {
        console.error('Invalid contact ID format:', interactingContact.id);
        toast.error("Invalid contact ID format");
        return;
      }
      
      // Call the API to save the interaction and update the contact's next reminder date
      const response = await fetch('/api/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          contactId: interactingContact.id,
          summary: summary || ''
        }),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Server returned an invalid response');
      }
      
      if (!response.ok) {
        console.error('API error response:', responseData);
        
        // Extract the most useful error message
        let errorMessage = 'Failed to save interaction';
        if (responseData.details) {
          if (typeof responseData.details === 'string') {
            errorMessage = responseData.details;
          } else if (responseData.details.message) {
            errorMessage = responseData.details.message;
          }
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
        
        throw new Error(errorMessage);
      }

      console.log('Interaction saved successfully:', responseData);
      
      // Remove the contact from the list since it's been handled
      setContactsList(contactsList.filter((contact) => contact.id !== interactingContact.id));
      toast.success(`Marked ${interactingContact.name} as done!`);
      
      // Close the modal
      setIsInteractionModalOpen(false);
      setInteractingContact(null);
    } catch (error) {
      console.error('Error saving interaction:', error);
      
      // Show more detailed error message if available
      let errorMessage = 'Failed to save interaction';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/');
      }
    }
  };

  const handleEditContact = (contact: any) => {
    setIsEditMode(true)
    setEditingContact(contact)
    setNewContact({
      name: contact.name,
      frequency: contact.frequency,
      notes: contact.notes,
      birthday: contact.birthday,
    })
    setIsModalOpen(true)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-noise flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-700 border-t-transparent" />
      </div>
    )
  }

  // Not authenticated state
  if (!user) {
    return null
  }

  // Main dashboard render
  return (
    <div className="min-h-screen bg-noise">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <div className="size-7 rounded-full bg-cyan-700 flex items-center justify-center text-white">
                <Bell className="size-3.5" />
              </div>
              <span className="text-cyan-950">Pebblr</span>
            </div>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="text-cyan-700 hover:text-cyan-900 hover:bg-gray-100">
                <Settings className="size-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-cyan-950">Your Inbox</h1>
            <p className="text-cyan-700 text-sm">
              You have{" "}
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-cyan-50 text-cyan-900 font-semibold">
                {contactsList.length} contacts
              </span>{" "}
              due for a check-in
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-cyan-600" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="w-full bg-white border-gray-200 pl-9 placeholder:text-gray-400"
            />
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-4 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-cyan-700 data-[state=active]:text-white transition-all hover:bg-cyan-50 hover:text-cyan-700 rounded-md"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="data-[state=active]:bg-cyan-700 data-[state=active]:text-white transition-all hover:bg-cyan-50 hover:text-cyan-700 rounded-md"
              >
                Weekly
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:bg-cyan-700 data-[state=active]:text-white transition-all hover:bg-cyan-50 hover:text-cyan-700 rounded-md"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="quarterly"
                className="data-[state=active]:bg-cyan-700 data-[state=active]:text-white transition-all hover:bg-cyan-50 hover:text-cyan-700 rounded-md"
              >
                Quarterly
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-3">
                {contactsList.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onMarkDone={() => markAsDone(contact.id)}
                    onEdit={() => handleEditContact(contact)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="mt-6">
              <div className="space-y-3">
                {contactsList
                  .filter((contact) => contact.frequency === "monthly")
                  .map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onMarkDone={() => markAsDone(contact.id)}
                      onEdit={() => handleEditContact(contact)}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="quarterly" className="mt-6">
              <div className="space-y-3">
                {contactsList
                  .filter((contact) => contact.frequency === "quarterly")
                  .map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onMarkDone={() => markAsDone(contact.id)}
                      onEdit={() => handleEditContact(contact)}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="mt-6">
              <div className="space-y-3">
                {contactsList
                  .filter((contact) => contact.frequency === "weekly")
                  .map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onMarkDone={() => markAsDone(contact.id)}
                      onEdit={() => handleEditContact(contact)}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => {
            setIsEditMode(false)
            setEditingContact(null)
            setNewContact({
              name: "",
              frequency: "monthly",
              notes: "",
              birthday: undefined,
            })
            setIsModalOpen(true)
          }}
          className={`fixed bottom-8 right-8 size-28 rounded-full bg-[#EC3E72] hover:bg-[#F06292] text-white flex flex-col items-center justify-center shadow-[0_4px_14px_rgba(236,62,114,0.4)] transition-all hover:shadow-[0_6px_20px_rgba(236,62,114,0.6)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#EC3E72] focus:ring-offset-2 focus:ring-offset-gray-50 z-20 ${
            isPulsing ? "animate-pulse" : ""
          }`}
          aria-label="Add new contact"
        >
          <Plus className="size-10 mb-1" />
          <span className="text-sm font-medium">Add Contact</span>
        </button>
      </main>

      {/* Add/Edit Contact Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-950">{isEditMode ? "Edit Contact" : "Add New Contact"}</DialogTitle>
            <DialogDescription className="text-cyan-700">
              {isEditMode ? "Update contact information" : "Add someone you want to stay in touch with regularly."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-cyan-900">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter contact name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="border-gray-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="frequency" className="text-cyan-900">
                Check-in Frequency
              </Label>
              <Select
                value={newContact.frequency}
                onValueChange={(value) => setNewContact({ ...newContact, frequency: value })}
              >
                <SelectTrigger id="frequency" className="border-gray-200">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes" className="text-cyan-900">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this contact"
                value={newContact.notes}
                onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                className="border-gray-200 min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birthday" className="text-cyan-900">
                Birthday
              </Label>
              <DatePicker
                date={newContact.birthday}
                setDate={(date) => setNewContact({ ...newContact, birthday: date })}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-gray-200 text-cyan-700 hover:text-cyan-900 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddContact}
              disabled={!newContact.name || isLoading}
              className="bg-cyan-700 hover:bg-cyan-800 text-white"
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Adding...</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </>
              ) : (
                'Add Contact'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interaction Modal */}
      {interactingContact && (
        <InteractionModal
          isOpen={isInteractionModalOpen}
          contactName={interactingContact.name}
          onClose={() => {
            // When closing without submitting, still call the API with an empty summary
            handleSaveInteraction('');
          }}
          onSave={handleSaveInteraction}
        />
      )}

      {/* Debug Components */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <TimeControls onDateChange={setCurrentDate} />
          <TableChecker />
          <AddSummaryColumn />
        </>
      )}
    </div>
  )
}

interface ContactCardProps {
  contact: {
    id: string
    name: string
    frequency: string
    daysOverdue: number
    notes: string
    birthday?: string | Date | null
    next_reminder_date?: string | Date | null
  }
  onMarkDone: () => void
  onEdit: () => void
}

function ContactCard({ contact, onMarkDone, onEdit }: ContactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [showEditIcon, setShowEditIcon] = useState(false)

  const handleMarkDone = () => {
    setIsChecked(true)
    // Simulate API call delay
    setTimeout(() => {
      onMarkDone()
    }, 600)
  }

  // Format birthday if it exists
  const formattedBirthday = contact.birthday
    ? new Intl.DateTimeFormat("en-US", { 
        month: "long", 
        day: "numeric" 
      }).format(typeof contact.birthday === 'string' ? new Date(contact.birthday) : contact.birthday)
    : null

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${isChecked ? "scale-95 opacity-0" : ""} ${
        contact.daysOverdue > 10 ? "border-[#F44336]/30" : "border-gray-200"
      } bg-white relative`}
      onMouseEnter={() => setShowEditIcon(true)}
      onMouseLeave={() => setShowEditIcon(false)}
    >
      {/* Checkbox that spans the entire right side */}
      <button
        onClick={handleMarkDone}
        disabled={isChecked}
        className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all border-l border-gray-200"
        aria-label="Mark as done"
      >
        <div className="w-6 h-6 rounded border-2 border-cyan-700 flex items-center justify-center relative overflow-hidden bg-white">
          {isChecked && <Check className="w-4 h-4 text-cyan-700" />}
          {isChecked && <div className="absolute inset-0 bg-cyan-100/50 animate-check" />}
        </div>
      </button>

      <div className="pr-10">
        {/* Add padding to account for the checkbox */}
        <CardHeader className="p-3 pb-1 relative">
          <CardTitle className="text-base font-medium text-cyan-950">{contact.name}</CardTitle>
          {showEditIcon && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-cyan-700 transition-colors"
              aria-label="Edit contact"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </CardHeader>
        <CardContent className="p-3 pt-1">
          <div className="flex items-center gap-2">
            <Badge
              variant={contact.daysOverdue > 10 ? "destructive" : "outline"}
              className={`rounded-sm text-xs px-1.5 py-0 h-5 ${
                contact.daysOverdue > 10
                  ? "bg-[#F44336]/10 text-[#F44336] hover:bg-[#F44336]/20 border-[#F44336]/30"
                  : "border-cyan-200 text-cyan-800 bg-cyan-50"
              }`}
            >
              {contact.daysOverdue} days overdue
            </Badge>

            <Badge className="rounded-sm text-xs px-1.5 py-0 h-5 bg-cyan-100 text-cyan-800">{contact.frequency}</Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0 ml-auto text-cyan-700 hover:text-cyan-900 hover:bg-gray-100"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {isExpanded && (
            <div className="mt-2 space-y-2 text-xs">
              {formattedBirthday && (
                <div className="flex items-center text-pink-600">
                  <Gift className="h-3.5 w-3.5 mr-1.5" />
                  <span>Birthday: {formattedBirthday}</span>
                </div>
              )}
              <p className="text-cyan-700">{contact.notes}</p>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}

