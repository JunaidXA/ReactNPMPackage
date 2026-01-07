import { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import {
  subDays,
  startOfMonth,
  endOfMonth,
  startOfToday,
  subMonths,
  format,
} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { enUS } from "date-fns/locale";
import { Locale } from "date-fns";


const predefinedRanges = [
  {
    label: "Today",
    range: () => ({ startDate: startOfToday(), endDate: startOfToday() }),
  },
  {
    label: "Yesterday",
    range: () => ({
      startDate: subDays(startOfToday(), 1),
      endDate: subDays(startOfToday(), 1),
    }),
  },
  {
    label: "Last 7 Days",
    range: () => ({ startDate: subDays(new Date(), 6), endDate: new Date() }),
  },
  {
    label: "Last 30 Days",
    range: () => ({ startDate: subDays(new Date(), 29), endDate: new Date() }),
  },
  {
    label: "This Month",
    range: () => ({
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    }),
  },
  {
    label: "Last Month",
    range: () => {
      const lastMonth = subMonths(new Date(), 1);
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth),
      };
    },
  },
  { label: "Custom Range", range: null },
];

// Force TypeScript to treat all fields in localize as required
const customLocale: Locale = {
  ...enUS,
  localize: {
    ...(enUS.localize as Required<NonNullable<Locale["localize"]>>),
    day: (n) => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][n],
  },
};

const DateRangeDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Today");
  const [range, setRange] = useState({
    startDate: startOfToday(),
    endDate: startOfToday(),
    key: "selection",
  });
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (
    label: string,
    rangeFn: (() => { startDate: Date; endDate: Date } | null) | null
  ) => {
    setSelectedLabel(label);
    if (rangeFn) {
      const newRange = rangeFn();
      if (newRange) {
        setRange({ ...newRange, key: "selection" });
        setDropdownOpen(false);
      }
    }
  };

  const formatDate = (date: Date): string => format(date, "MM/dd/yyyy");

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div
        className="relative inline-block text-left font-nunito"
        ref={dropdownRef}
      >
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="border px-4 py-2 rounded shadow-sm bg-white text-sm font-medium flex items-center gap-2 border-gray-300"
        >
          <i className="ti ti-calendar text-lg"></i>
          {`${formatDate(range.startDate)} - ${formatDate(range.endDate)}`}
        </button>

        {dropdownOpen && (
          <div className="absolute z-10 mt-2 bg-white  rounded-md shadow-lg  text-gray-600">
            <div className="flex border-b border-gray-300 sm:flex-nowrap flex-wrap">
              {/* Sidebar - Preset List */}
              <div className="relative sm:border-r sm:border-gray-300">
                {/* Arrow positioned absolutely relative to this wrapper */}
                <div className="absolute top-0 left-6 -translate-y-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>

                {/* Dropdown box */}
                <div className="dropdownContainer bg-white rounded ">
                  <div className="w-72 sm:w-35 mt-2.5">
                    {predefinedRanges.map((item) => (
                      <div
                        key={item.label}
                        className={`px-4 py-2 cursor-pointer color-text-secondary text-md datePickerLabels ${
                          selectedLabel === item.label
                            ? "bg-[#FE9F43] text-white"
                            : ""
                        }`}
                        onClick={() => handleSelect(item.label, item.range)}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calendar - Only if "Custom Range" is selected */}
              {selectedLabel === "Custom Range" && (
                <div>
                  <div className="datePicker">
                    <DateRange
                      ranges={[range]}
                      onChange={(item) => {
                        const selection = item.selection;
                        if (selection.startDate && selection.endDate) {
                          setRange({
                            startDate: selection.startDate,
                            endDate: selection.endDate,
                            key: "selection",
                          });
                        }
                      }}
                      months={2}
                      direction="horizontal"
                      showMonthArrow={true}
                      rangeColors={["#FE9F43"]}
                      showMonthAndYearPickers={false}
                      locale={customLocale}
                    />
                  </div>
                </div>
              )}
            </div>
            {selectedLabel === "Custom Range" && (
              <div className="flex justify-end gap-3 items-center  text-sm  p-2.5">
                <span className="text-xsm">{`${formatDate(
                  range.startDate
                )} - ${formatDate(range.endDate)}`}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className=" font-bold text-black"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className="bg-[#fe9f43] text-white px-3 py-1 rounded font-bold"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DateRangeDropdown;
