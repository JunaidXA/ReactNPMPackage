import  { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card"; // Your existing card components

// Helper functions
const isSameDay = (d1: Date, d2: Date) => 
  d1.getDate() === d2.getDate() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getFullYear() === d2.getFullYear();

const formatDate = (date: Date) => 
  date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });

const getDaysInMonth = (year: number, month: number) => 
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) => 
  new Date(year, month, 1).getDay();

// Calendar Month Component
const CalendarMonth = ({ 
  year, 
  month, 
  selectedRange,
  onDateClick 
}: {
  year: number;
  month: number;
  selectedRange: { start?: Date; end?: Date };
  onDateClick: (date: Date) => void;
}) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  // Generate days array with padding for previous/next month
  const days = [];
  const daysFromPrevMonth = firstDay;
  const prevMonthDays = getDaysInMonth(year, month - 1);
  
  // Previous month days
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthDays - i);
    days.push({ date, isCurrentMonth: false });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({ date, isCurrentMonth: true });
  }
  
  // Next month days (to fill grid)
  const remaining = 42 - days.length; // 6 weeks
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(year, month + 1, i);
    days.push({ date, isCurrentMonth: false });
  }

  // Check if a date is in the selected range
  const isInRange = (date: Date) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    return date > selectedRange.start && date < selectedRange.end;
  };

  // Check if date is start/end of range
  const isStart = (date: Date) => 
    selectedRange.start && isSameDay(date, selectedRange.start);
  
  const isEnd = (date: Date) => 
    selectedRange.end && isSameDay(date, selectedRange.end);
  
  const isToday = (date: Date) => 
    isSameDay(date, today);

  return (
    <div className="w-full">
      <div className="text-center font-medium mb-2">
        {new Date(year, month).toLocaleDateString("en-US", { 
          month: "long", 
          year: "numeric" 
        })}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {days.map(({ date, isCurrentMonth }, idx) => (
          <button
            key={idx}
            onClick={() => onDateClick(date)}
            className={cn(
              "text-center text-sm p-1.5 rounded cursor-pointer",
              isCurrentMonth ? "text-gray-900" : "text-gray-400",
              isToday(date) && "font-bold",
              isInRange(date) && "bg-blue-100",
              isStart(date) && "bg-blue-500 text-white rounded-r-none",
              isEnd(date) && "bg-blue-500 text-white rounded-l-none",
              isStart(date) && isEnd(date) && "rounded"
            )}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Date Range Picker Component
export const DateRangePicker = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [tempStart, setTempStart] = useState<Date | undefined>();
  const [tempEnd, setTempEnd] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isOpen, setIsOpen] = useState(false);

  // Handle date selection
  const handleDateClick = useCallback((date: Date) => {
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(date);
      setTempEnd(undefined);
    } else if (date < tempStart) {
      setTempStart(date);
      setTempEnd(tempStart);
    } else {
      setTempEnd(date);
    }
  }, [tempStart, tempEnd]);

  // Set predefined ranges
  const setRange = useCallback((start: Date, end: Date) => {
    setTempStart(start);
    setTempEnd(end);
    // Set calendar view to show the range
    setCurrentMonth(start.getMonth());
    setCurrentYear(start.getFullYear());
  }, []);

  // Apply selection
  const applySelection = () => {
    if (tempStart && tempEnd) {
      setStartDate(tempStart);
      setEndDate(tempEnd);
      setIsOpen(false);
    }
  };

  // Reset to previous selection when canceling
  const cancelSelection = () => {
    setTempStart(startDate);
    setTempEnd(endDate);
    setIsOpen(false);
  };

  // Navigation between months
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentYear, currentMonth + direction, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  // Predefined ranges
  const predefinedRanges = [
    { 
      label: "Today", 
      action: () => setRange(today, today) 
    },
    { 
      label: "Yesterday", 
      action: () => {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        setRange(yesterday, yesterday);
      }
    },
    { 
      label: "Last 7 Days", 
      action: () => {
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        setRange(start, today);
      }
    },
    { 
      label: "Last 30 Days", 
      action: () => {
        const start = new Date(today);
        start.setDate(start.getDate() - 29);
        setRange(start, today);
      }
    },
    { 
      label: "This Month", 
      action: () => {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setRange(start, end);
      }
    },
    { 
      label: "Last Month", 
      action: () => {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        setRange(start, end);
      }
    },
    { 
      label: "Custom Range", 
      action: () => {
        setTempStart(undefined);
        setTempEnd(undefined);
      }
    }
  ];

  // Initialize temp dates when opening
  useEffect(() => {
    if (isOpen) {
      setTempStart(startDate);
      setTempEnd(endDate);
    }
  }, [isOpen, startDate, endDate]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 w-64"
      >
        <span>
          {startDate && endDate 
            ? `${formatDate(startDate)} - ${formatDate(endDate)}` 
            : "Select date range"}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <Card className="absolute z-50 mt-1 w-[600px]">
          <CardContent className="flex p-0">
            {/* Predefined Ranges */}
            <div className="w-1/3 border-r p-4">
              <div className="space-y-2">
                {predefinedRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={range.action}
                    className={cn(
                      "block w-full text-left p-2 rounded text-sm hover:bg-gray-100",
                      range.label === "Custom Range" && 
                        // !predefinedRanges.some(r => 
                        //   r.label !== "Custom Range" && 
                        //   isSameDay(tempStart!, r.action().start) && 
                        //   isSameDay(tempEnd!, r.action().end)
                        // ) && 
                        "bg-gray-100"
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar View */}
            <div className="w-2/3 p-4">
              {/* Navigation */}
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => navigateMonth(-1)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="text-sm font-medium">
                  {new Date(currentYear, currentMonth).toLocaleDateString("en-US", { 
                    month: "long", 
                    year: "numeric" 
                  })}
                  {" - "}
                  {new Date(currentYear, currentMonth + 1).toLocaleDateString("en-US", { 
                    month: "long", 
                    year: "numeric" 
                  })}
                </div>
                <button 
                  onClick={() => navigateMonth(1)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Calendars */}
              <div className="flex gap-4">
                <CalendarMonth
                  year={currentYear}
                  month={currentMonth}
                  selectedRange={{ start: tempStart, end: tempEnd }}
                  onDateClick={handleDateClick}
                />
                <CalendarMonth
                  year={currentMonth === 11 ? currentYear + 1 : currentYear}
                  month={currentMonth + 1}
                  selectedRange={{ start: tempStart, end: tempEnd }}
                  onDateClick={handleDateClick}
                />
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm">
                  {tempStart && tempEnd
                    ? `${formatDate(tempStart)} - ${formatDate(tempEnd)}`
                    : tempStart
                    ? `${formatDate(tempStart)} - ...`
                    : "Select date range"}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={cancelSelection}
                    className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applySelection}
                    disabled={!tempStart || !tempEnd}
                    className={cn(
                      "text-sm px-3 py-1.5 rounded text-white",
                      tempStart && tempEnd
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    )}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};