import { useState, useRef, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameDay,
} from "date-fns";

type PresetLabel =
  | "Today"
  | "Yesterday"
  | "Last 7 Days"
  | "Last 30 Days"
  | "This Month"
  | "Last Month"
  | "Custom Range";

const presets: PresetLabel[] = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
  "Custom Range",
];

const getPresetDates = (label: PresetLabel): [Date, Date] => {
  const today = new Date();
  const yesterday = addDays(today, -1);

  switch (label) {
    case "Today":
      return [today, today];
    case "Yesterday":
      return [yesterday, yesterday];
    case "Last 7 Days":
      return [addDays(today, -6), today];
    case "Last 30 Days":
      return [addDays(today, -29), today];
    case "This Month":
      return [startOfMonth(today), endOfMonth(today)];
    case "Last Month":
      const lastMonth = subMonths(today, 1);
      return [startOfMonth(lastMonth), endOfMonth(lastMonth)];
    default:
      return [today, today];
  }
};

const CustomDateDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [nextMonth, setNextMonth] = useState(addMonths(new Date(), 1));
  const [selectedRange, setSelectedRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [isSelecting, setIsSelecting] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [activePreset, setActivePreset] = useState("Today");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedRange[0] || !selectedRange[1]) {
      const [start, end] = getPresetDates("Today");
      setSelectedRange([start, end]);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onDateClick = (date: Date) => {
    if (!isSelecting) {
      setTempRange([date, null]);
      setIsSelecting(true);
    } else {
      const [start] = tempRange;
      if (start) {
        const range: [Date | null, Date | null] =
          date < start ? [date, start] : [start, date];
        setTempRange(range);
        setIsSelecting(false);
        setActivePreset("Custom Range");
      }
    }
  };

  const renderHeader = (
    month: Date,
    {
      showPrev = false,
      showNext = false,
    }: { showPrev?: boolean; showNext?: boolean } = {}
  ) => (
    <div className="flex justify-between items-center px-4 py-2">
      {showPrev ? (
        <button
          onClick={() => {
            const newCurrent = subMonths(currentMonth, 1);
            setCurrentMonth(newCurrent);
            setNextMonth(addMonths(newCurrent, 1));
          }}
        >
          <i className="ti ti-chevron-left text-lg font-bolder icon-bold"></i>
        </button>
      ) : (
        <span className="w-4" />
      )}
      <span className="font-bold text-xs text-[#646b72]">
        {format(month, "MMM yyyy")}
      </span>
      {showNext ? (
        <button
          onClick={() => {
            const newNext = addMonths(nextMonth, 1);
            setNextMonth(newNext);
            setCurrentMonth(subMonths(newNext, 1));
          }}
        >
          <i className="ti ti-chevron-right text-lg font-bolder icon-bold"></i>
        </button>
      ) : (
        <span className="w-4" />
      )}
    </div>
  );

  const renderDays = (viewMonth: Date) => {
    const startDate = startOfWeek(startOfMonth(viewMonth));
    const days: Date[] = [];

    for (let i = 0; i < 42; i++) {
      days.push(addDays(startDate, i));
    }

    return (
      <div
        className="bg-white px-2 py-1 rounded grid grid-cols-7 text-center text-xs date-picker"
        style={{ fontFamily: "Arial" }}
      >
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-[#696868] mb-2 font-bold">
            {d}
          </div>
        ))}

        {days.map((day, i) => {
          const isInThisMonth = day.getMonth() === viewMonth.getMonth();
          const [start, end] = tempRange;
          const inRange = start && end && day > start && day < end;
          const isStart = start && isSameDay(day, start);
          const isEnd = end && isSameDay(day, end);
          const isHovered =
            hoverDate && isSelecting && start && day > start && day < hoverDate;
          
          return (
            <div
              key={i}
              onClick={() => isInThisMonth && onDateClick(day)}
              onMouseEnter={() => isInThisMonth && setHoverDate(day)}
              className={`py-1 ${
                isInThisMonth
                  ? "cursor-pointer"
                  : "text-gray-400 cursor-default pointer-events-none"
              }
            ${isInThisMonth ? "text-[#555454]" : ""}
            ${isStart || isEnd ? "bg-[#FE9F43] text-white font-semibold" : ""}
            ${
              inRange || isHovered
                ? "bg-[#e8f2f7da] text-text-primary font-normal"
                : ""
            }
            ${isStart ? "rounded-l" : ""}
            ${isEnd ? "rounded-r" : ""}
            ${!isStart && !isEnd && isInThisMonth ? "hover:bg-gray-200" : ""}
            `}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    );
  };

  const handlePresetClick = (preset: PresetLabel) => {
    const range = getPresetDates(preset) as [Date, Date]; // 👈 tell TS this is a tuple

    setTempRange(range);
    setIsSelecting(false);
    setActivePreset(preset);

    if (preset !== "Custom Range") {
      setSelectedRange(range);
      setIsOpen(false);
    }
  };

  const applySelection = () => {
    setSelectedRange(tempRange);
    setIsOpen(false);
  };

  const cancelSelection = () => {
    setTempRange(selectedRange);
    setIsOpen(false);
  };

  const displayText =
    selectedRange[0] && selectedRange[1]
      ? `${format(selectedRange[0], "MM/dd/yyyy")} - ${format(
          selectedRange[1],
          "MM/dd/yyyy"
        )}`
      : "Select date";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setTempRange(selectedRange);
        }}
        className="border border-gray-200 rounded p-2 bg-white  text-sm text-gray-800 w-52 gap-3 flex  items-center"
      >
        <i className="ti ti-calendar text-base"></i>
        <span className="text-sm">{displayText}</span>
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 bg-white border border-gray-200 rounded  ${
            activePreset === "Custom Range"
              ? "w-[280px] md:w-[600px] "
              : "w-[140px]"
          }`}
        >
          <div className="absolute triangle left-4 w-0 h-0">
            <svg width="20" height="10">
              <polygon
                points="0,10 10,0 20,10"
                fill="white"
                stroke="#e5e7eb" // Gray border
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="10"
                x2="20"
                y2="10"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div
            className="flex flex-col md:flex-row"
            style={{ fontFamily: "Arial" }}
          >
            {/* Preset List */}
            <div className="w-full  md:w-[140px] h-[231px]">
              {presets.map((p, i) => (
                <div
                  key={p}
                  onClick={() => handlePresetClick(p)}
                  style={{ fontFamily: "Arial" }}
                  className={`px-3 py-1 cursor-pointer text-[12px] mb-1 ${
                    i === 0 ? "mt-2" : ""
                  } ${
                    activePreset === p
                      ? "bg-[#FE9F43] text-white py-2 px-3"
                      : "hover:bg-gray-100 text-[#646b72]"
                  }`}
                >
                  {p}
                </div>
              ))}
            </div>

            {/* Date Picker: only show for "Custom Range" */}
            {activePreset === "Custom Range" && (
              <div className="flex-1 px-1 border-l border-gray-300">
                <div className="flex gap-1 mt-1 flex-wrap md:flex-nowrap">
                  <div className="w-full md:w-1/2">
                    {renderHeader(currentMonth, { showPrev: true })}
                    {renderDays(currentMonth)}
                  </div>
                  <div className="w-full md:w-1/2">
                    {renderHeader(nextMonth, { showNext: true })}
                    {renderDays(nextMonth)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with Apply/Cancel: only for Custom Range */}
          {activePreset === "Custom Range" && (
            <div className="flex justify-end p-2 gap-5 border-t-1 border-gray-300 items-center">
              <span className="text-xs text-[#646b72] font-semibold">
                {tempRange[0] && tempRange[1]
                  ? `${format(tempRange[0], "MM/dd/yyyy")} - ${format(
                      tempRange[1],
                      "MM/dd/yyyy"
                    )}`
                  : "Select a range"}
              </span>
              <div className="flex gap-2">
                <button
                  style={{ fontFamily: "Arial" }}
                  className="text-sm text-black font-bold"
                  onClick={cancelSelection}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#FE9F43] px-4 py-1 text-sm text-white rounded"
                  onClick={applySelection}
                  style={{ fontFamily: "Arial" }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { CustomDateDropdown };
