"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface InteractionModalProps {
  isOpen: boolean
  contactName: string
  onClose: () => void
  onSave: (summary: string) => void
}

export function InteractionModal({ isOpen, contactName, onClose, onSave }: InteractionModalProps) {
  const [summary, setSummary] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await onSave(summary)
      setSummary("") // Reset form after successful submission
    } catch (error) {
      console.error("Error saving interaction:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSummary("") // Reset form on close
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Interaction with {contactName}</DialogTitle>
          <DialogDescription>
            Record a summary of your interaction with {contactName}. This will help you remember what you discussed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="summary">Interaction Summary</Label>
            <Textarea
              id="summary"
              placeholder="What did you talk about?"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Skip
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-cyan-700 hover:bg-cyan-800 text-white"
          >
            {isSubmitting ? "Saving..." : "Save & Complete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 