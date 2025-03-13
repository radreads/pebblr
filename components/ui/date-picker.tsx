"use client"

import { useState, useEffect } from "react"
import { parse, isValid, format } from "date-fns"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
  const [inputValue, setInputValue] = useState("")
  const [inputError, setInputError] = useState(false)

  // Update input value when date changes externally
  useEffect(() => {
    if (date) {
      setInputValue(format(date, "MM/dd/yy"))
    } else {
      setInputValue("")
    }
  }, [date])

  // Handle manual input
  const handleInputChange = (value: string) => {
    setInputValue(value)
    setInputError(false)

    // If empty, clear the date
    if (!value.trim()) {
      setDate(undefined)
      return
    }

    // Try to parse the date
    try {
      const parsedDate = parse(value, "MM/dd/yy", new Date())
      if (isValid(parsedDate)) {
        setDate(parsedDate)
      } else {
        setInputError(true)
      }
    } catch {
      setInputError(true)
    }
  }

  return (
    <Input
      value={inputValue}
      onChange={(e) => handleInputChange(e.target.value)}
      placeholder="MM/DD/YY"
      className={cn(
        inputError && "border-red-500 focus-visible:ring-red-500",
        className
      )}
    />
  )
}

