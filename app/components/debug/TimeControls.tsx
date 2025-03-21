import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CalendarDays, RotateCcw } from "lucide-react";

interface TimeControlsProps {
  onDateChange: (newDate: Date) => void;
  currentDate?: Date;
}

export function TimeControls({ onDateChange, currentDate }: TimeControlsProps) {
  const [mockDate, setMockDate] = useState(currentDate || new Date());
  
  const addDays = (days: number) => {
    const newDate = new Date(mockDate);
    newDate.setDate(newDate.getDate() + days);
    setMockDate(newDate);
    onDateChange(newDate);
  };
  
  const resetDate = () => {
    const today = new Date();
    setMockDate(today);
    onDateChange(today);
  };
  
  return (
    <div className="fixed bottom-8 left-8 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays className="h-4 w-4" />
          <span>Debug Date:</span>
          <span className="font-mono">
            {mockDate.toLocaleDateString()}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => addDays(1)} className="flex-1">
              +1 Day
            </Button>
            <Button variant="outline" size="sm" onClick={() => addDays(7)} className="flex-1">
              +1 Week
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => addDays(30)} className="flex-1">
              +1 Month
            </Button>
            <Button variant="destructive" size="sm" onClick={resetDate} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
