"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0", className)}
      classNames={{
        root: "w-full",
        months: "flex flex-col",
        month: "space-y-4",
        caption: "relative flex justify-center items-center h-10",
        caption_label: "text-base font-medium text-cyan-950",
        nav: "absolute flex items-center space-x-1",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 hover:bg-cyan-50 hover:text-cyan-900",
          "opacity-75 hover:opacity-100 transition-opacity"
        ),
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7 mb-1",
        head_cell: cn(
          "text-cyan-600 font-medium text-xs w-9 h-9",
          "flex items-center justify-center"
        ),
        row: "grid grid-cols-7",
        cell: cn(
          "relative p-0 text-center focus-within:relative focus-within:z-20",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-sm",
          "hover:bg-cyan-50 hover:text-cyan-900 focus:bg-cyan-50 focus:text-cyan-900",
          "aria-selected:opacity-100"
        ),
        day_selected: cn(
          "bg-cyan-700 text-white hover:bg-cyan-700 hover:text-white",
          "focus:bg-cyan-700 focus:text-white"
        ),
        day_today: "bg-cyan-50 text-cyan-900",
        day_outside: cn(
          "text-gray-400 opacity-50 aria-selected:bg-cyan-50/50",
          "aria-selected:text-gray-500 aria-selected:opacity-30"
        ),
        day_disabled: "text-gray-400 opacity-50",
        day_range_middle: "aria-selected:bg-cyan-50 aria-selected:text-cyan-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

