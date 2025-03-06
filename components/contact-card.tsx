"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "@/components/ui/card"
import { Check, ChevronDown, Gift } from "lucide-react"

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
}

export function ContactCard({ contact, onMarkDone }: ContactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

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
        <CardHeader className="p-3 pb-1">
          <CardTitle className="text-base font-medium text-cyan-950">{contact.name}</CardTitle>
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
            <div className="mt-2 space-y-2">
              {contact.notes && <p className="text-xs text-cyan-700">{contact.notes}</p>}
              {formattedBirthday && (
                <div className="flex items-center text-xs text-pink-600">
                  <Gift className="h-3.5 w-3.5 mr-1.5" />
                  <span>Birthday: {formattedBirthday}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}

