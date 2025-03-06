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

// Mock data for demonstration
const contacts = [
  {
    id: "1",
    name: "Alex Johnson",
    frequency: "monthly",
    daysOverdue: 5,
    notes: "Discussed new project ideas",
    birthday: new Date(1990, 5, 15), // June 15, 1990
  },
  {
    id: "2",
    name: "Sam Taylor",
    frequency: "quarterly",
    daysOverdue: 12,
    notes: "Birthday coming up next month",
    birthday: new Date(1985, 8, 22), // September 22, 1985
  },
  {
    id: "3",
    name: "Jamie Smith",
    frequency: "annual",
    daysOverdue: 3,
    notes: "Moving to a new city",
    birthday: new Date(1992, 2, 8), // March 8, 1992
  },
  {
    id: "4",
    name: "Morgan Lee",
    frequency: "semi-annual",
    daysOverdue: 20,
    notes: "Catch up on career change",
    birthday: new Date(1988, 11, 30), // December 30, 1988
  },
  {
    id: "5",
    name: "Casey Wilson",
    frequency: "monthly",
    daysOverdue: 8,
    notes: "Follow up on coffee meetup",
    birthday: new Date(1995, 3, 12), // April 12, 1995
  },
  {
    id: "6",
    name: "Taylor Reed",
    frequency: "quarterly",
    daysOverdue: 7,
    notes: "Discuss collaboration opportunity",
    birthday: new Date(1991, 7, 5), // August 5, 1991
  },
]

export default function Dashboard() {
  const [contactsList, setContactsList] = useState(contacts)
  const [isPulsing, setIsPulsing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingContact, setEditingContact] = useState<any>(null)
  const [newContact, setNewContact] = useState({
    name: "",
    frequency: "monthly",
    notes: "",
    birthday: undefined as Date | undefined,
  })

  // Add a pulsing effect every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true)
      setTimeout(() => setIsPulsing(false), 1000)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const markAsDone = (id: string) => {
    setContactsList(contactsList.filter((contact) => contact.id !== id))
  }

  const handleAddContact = () => {
    if (isEditMode && editingContact) {
      // Update existing contact
      setContactsList(
        contactsList.map((contact) =>
          contact.id === editingContact.id
            ? {
                ...contact,
                name: newContact.name,
                frequency: newContact.frequency,
                notes: newContact.notes,
                birthday: newContact.birthday,
              }
            : contact,
        ),
      )
      setIsEditMode(false)
      setEditingContact(null)
    } else {
      // Create a new contact with a random ID and 0 days overdue
      const newContactWithId = {
        id: Math.random().toString(36).substring(2, 9),
        name: newContact.name,
        frequency: newContact.frequency,
        daysOverdue: 0,
        notes: newContact.notes,
        birthday: newContact.birthday,
      }

      // Add the new contact to the list
      setContactsList([newContactWithId, ...contactsList])
    }

    // Reset the form
    setNewContact({
      name: "",
      frequency: "monthly",
      notes: "",
      birthday: undefined,
    })

    // Close the modal
    setIsModalOpen(false)
  }

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
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddContact}
                disabled={!newContact.name}
                className="bg-cyan-700 hover:bg-cyan-800 text-white"
              >
                {isEditMode ? "Save Changes" : "Add Contact"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
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
    birthday?: Date
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
    ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(contact.birthday)
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

