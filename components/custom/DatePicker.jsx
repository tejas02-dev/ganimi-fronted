"use client"
import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Helper function to validate date
const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date)
}

// Helper function to format date
const formatDate = (date) => {
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  })
}

export default function DatePicker({ 
  label = "Date", 
  placeholder = "Select a date", 
  value, 
  onChange,
  className = "" 
}) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState(value ? new Date(value) : undefined)
  const [month, setMonth] = React.useState(date || new Date())
  const [inputValue, setInputValue] = React.useState(
    value ? formatDate(new Date(value)) : ""
  )

  // Update internal state when external value changes
  React.useEffect(() => {
    if (value) {
      const newDate = new Date(value)
      if (isValidDate(newDate)) {
        setDate(newDate)
        setInputValue(formatDate(newDate))
        setMonth(newDate)
      }
    } else {
      setDate(undefined)
      setInputValue("")
    }
  }, [value])

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    const formattedDate = formatDate(selectedDate)
    setInputValue(formattedDate)
    setOpen(false)
    
    // Call onChange with the selected date
    if (onChange) {
      onChange(selectedDate)
    }
  }

  const handleInputChange = (e) => {
    const inputVal = e.target.value
    setInputValue(inputVal)
    
    // Try to parse the input as a date
    const parsedDate = new Date(inputVal)
    if (isValidDate(parsedDate)) {
      setDate(parsedDate)
      setMonth(parsedDate)
      if (onChange) {
        onChange(parsedDate)
      }
    }
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Label htmlFor="date" className="px-1">
        {label}
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={inputValue}
          placeholder={placeholder}
          className="bg-background pr-10"
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}