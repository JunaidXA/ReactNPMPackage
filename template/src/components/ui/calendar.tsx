import * as React from "react";
import {
  Calendar1Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from "lucide-react";
import {
  DayButton,
  DayPicker,
  DropdownOption,
  getDefaultClassNames,
  Matcher,
  useDayPicker,
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "./popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { IconButton } from "./miscellaneous";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "calenderBtn",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-white rounded-md  group/calendar p-3 [--cell-size:--spacing(8)] ",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit ", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row  relative ",
          defaultClassNames.months
        ),
        month: cn("flex  flex-col w-full gap-2", defaultClassNames.month),
        nav: cn(
          "flex  items-center gap-1 w-full absolute top-0 inset-x-0 justify-between ",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-6 mt-1 p-0 select-none hover:bg-text-primary hover:text-white  !rounded-full ",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-6 mt-1 p-0 select-none hover:bg-text-primary hover:text-white  !rounded-full ",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex  items-center justify-center h-(--cell-size) w-full px-(--cell-size) ",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size)  gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border-gray-300 border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("absolute inset-0 opacity-0 ", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse ",
        weekdays: cn("flex ", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground font-black !font-nunito text-text-primary rounded-md flex-1 text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size) ",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground ",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full text-text-secondary h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-md bg-accent",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
        today: cn(
          "!bg-primary !text-white rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },

        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="calenderBtn"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-white data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

interface DatePickerProps {
  placeholder?: string;
  onDateChange?: (date: Date | undefined) => void;
  error?: string;
  value?: Date;
  disabled?: boolean;
  triggerClassName?: string;
  disableDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  dateRangeMode?: "singleYear" | "custom" | "unlimited" | "fromStart";
}

function CustomDropdown({
  options,
  value,
  onValueChange,
  className,
}: {
  options: DropdownOption[];
  value?: number | string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Select value={String(value)} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            "!h-7 w-full px-3 font-nunito text-sm focus:outline-none focus:ring-0 focus:ring-gray-300",
            "flex items-center border border-border-gray bg-white rounded-[5.6px]",
            value ? "text-black" : "text-gray-500"
          )}
        >
          {value ? <SelectValue /> : "Select Value"}
        </SelectTrigger>
        <SelectContent className="min-w-[var(--radix-select-trigger-width)] max-h-80 rounded-lg border-gray-200 bg-white pb-1">
          <SelectGroup className="w-full">
            {options?.map((option, index) => (
              <SelectItem
                key={index}
                value={String(option.value)}
                className={cn(
                  "w-full px-3 py-2 text-sm text-gray-500 !hover:text-primary-700 focus:bg-primary focus:text-white"
                )}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

const DatePicker: React.FC<DatePickerProps> = ({
  onDateChange,
  error,
  value,
  placeholder,
  disabled,
  triggerClassName,
  disableDate,
  dateRangeMode = "fromStart", // Default to fromStart to maintain current behavior
  minDate,
  maxDate,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(value);

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  };

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const startYear = 2025;

  let fromDate: Date | undefined;
  let toDate: Date | undefined;

  const disabledDates: Matcher[] = [];

  if (dateRangeMode === "singleYear") {
    fromDate = today;
    toDate = new Date(today);
    toDate.setFullYear(today.getFullYear() + 1);

    disabledDates.push({ before: fromDate });
    disabledDates.push({ after: toDate });
  } else if (dateRangeMode === "custom") {
    if (minDate) {
      fromDate = minDate;
      disabledDates.push({ before: minDate });
    }
    if (maxDate) {
      toDate = maxDate;
      disabledDates.push({ after: maxDate });
    }
  } else if (dateRangeMode === "fromStart") {
    // Default behavior - maintains current functionality
    fromDate = disableDate ?? new Date(startYear, 0, 1); // January 1, 2025
    toDate = new Date(currentYear + 1, 11, 31); // December 31, next year

    disabledDates.push({ before: fromDate });
  } else if (dateRangeMode === "unlimited") {
    // No restrictions
    fromDate = undefined;
    toDate = undefined;
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "";

    const d = typeof date === "string" ? new Date(date) : date;

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getAllowedMonthOptions = (year: number): DropdownOption[] => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const options: DropdownOption[] = [];

    let start = 0,
      end = 11;

    if (fromDate && year === fromDate.getFullYear())
      start = fromDate.getMonth();
    if (toDate && year === toDate.getFullYear()) end = toDate.getMonth();

    for (let i = start; i <= end; i++) {
      options.push({ value: i, label: monthNames[i], disabled: false });
    }
    return options;
  };

  const getAllowedYearOptions = (): DropdownOption[] => {
    const start = fromDate?.getFullYear() ?? currentYear - 0; // fallback wide range
    const end = toDate?.getFullYear() ?? currentYear + 1;
    const years: DropdownOption[] = [];
    for (let y = start; y <= end; y++) {
      years.push({ value: y, label: String(y), disabled: false });
    }
    return years;
  };

  return (
    <div className="w-full space-y-2 !border-gray-300 !font-nunito">
      <Popover>
        <PopoverTrigger
          asChild
          className={cn(
            "rounded-md border px-3.5 h-9.5",
            error ? "border-error-maindark" : "border-border-gray",
            triggerClassName
          )}
        >
          <button
            className="!m-0 flex w-full items-center text-left text-gray-700 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={disabled}
          >
            <span
              className={cn(
                date ? "text-gray-900 w-full" : "text-gray-400 w-full text-md"
              )}
            >
              <div className="flex justify-between w-full items-center">
                {date ? formatDate(date) : placeholder ?? "DD-MM-YYYY"}
                <Calendar1Icon className="text-text-primary ml-2" size={16} />
              </div>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto rounded-md p-0 shadow-md border-gray-300"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            className="!font-nunito text-sm"
            captionLayout="dropdown"
            disabled={disabledDates.length > 0 ? disabledDates : undefined}
            toYear={new Date().getFullYear() + 1}
            components={{
              MonthsDropdown: () => {
                const { months, goToMonth } = useDayPicker();
                const displayYear =
                  months[0]?.date.getFullYear() ?? currentYear;
                return (
                  <CustomDropdown
                    options={getAllowedMonthOptions(displayYear)}
                    value={String(months[0]?.date.getMonth() ?? "")}
                    onValueChange={(val) => {
                      console.log(val);
                      const monthIndex = parseInt(val, 10);
                      goToMonth(new Date(displayYear, monthIndex, 1));
                    }}
                  />
                );
              },
              YearsDropdown: () => {
                const { months, goToMonth } = useDayPicker();
                const displayYear =
                  months[0]?.date.getFullYear() ?? currentYear;
                const displayMonth = months[0]?.date.getMonth();

                return (
                  <CustomDropdown
                    options={getAllowedYearOptions()}
                    value={String(displayYear)}
                    onValueChange={(val) => {
                      const year = parseInt(val, 10);
                      goToMonth(new Date(year, displayMonth, 1));
                    }}
                  />
                );
              },
              Chevron: ({ className, orientation, ...props }) => {
                const { months } = useDayPicker();
                const isJan2025 =
                  months[0]?.date.getFullYear() === 2025 &&
                  months[0]?.date.getMonth() === 0;
                if (orientation === "left") {
                  return (
                    <IconButton
                      icon={
                        <ChevronLeftIcon
                          className={cn(
                            "size-4",
                            className,
                            isJan2025 && "!hover:bg-white"
                          )}
                          {...props}
                        />
                      }
                      disabled={isJan2025}
                    />
                  );
                }

                if (orientation === "right") {
                  return (
                    <ChevronRightIcon
                      className={cn("size-4", className)}
                      {...props}
                    />
                  );
                }

                return (
                  <ChevronDownIcon
                    className={cn("size-4", className)}
                    {...props}
                  />
                );
              },
            }}
          />
        </PopoverContent>
      </Popover>
      {/* {error && <div className="!mt-0 text-6xs text-error-500">{error}</div>} */}
    </div>
  );
};

interface TimePickerProps {
  value?: string;
  onTimeChange: (time: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  triggerClassName?: string;
}

const CustomTimePicker: React.FC<TimePickerProps> = ({
  value,
  onTimeChange,
  placeholder,
  disabled,
  error,
  triggerClassName,
}) => {
  const now = new Date();
  const roundedMinute = Math.round(now.getMinutes() / 5) * 5;
  const twelveHour = now.getHours() % 12 || 12;
  const ampmInitial = now.getHours() >= 12 ? "PM" : "AM";

  const [hour, setHour] = React.useState<number>(twelveHour);
  const [minute, setMinute] = React.useState<number>(
    roundedMinute === 60 ? 55 : roundedMinute // ensure 55 instead of 60
  );
  const [ampm, setAmPm] = React.useState<"AM" | "PM">(ampmInitial);
  const [open, setOpen] = React.useState(false);

  const hourRef = React.useRef<HTMLDivElement>(null);
  const minuteRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (value) {
      const [time, period] = value.split(" ");
      const [h, m] = time.split(":").map(Number);
      setHour(h);
      setMinute(m);
      setAmPm(period as "AM" | "PM");
    }
  }, [value]);

  const handleSelect = (h: number, m: number, p: "AM" | "PM") => {
    const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )} ${p}`;
    onTimeChange(formatted);
    setOpen(false);
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        const selectedHour = hourRef.current?.querySelector(
          `[data-hour="${hour}"]`
        ) as HTMLElement;
        const selectedMinute = minuteRef.current?.querySelector(
          `[data-minute="${minute}"]`
        ) as HTMLElement;

        selectedHour?.scrollIntoView({ block: "start", behavior: "auto" });
        selectedMinute?.scrollIntoView({ block: "start", behavior: "auto" });
      }, 50);
    }
  }, [open, hour, minute]);

  return (
    <div className="w-full space-y-2 !border-gray-300 !font-nunito">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          className={cn(
            "rounded-md border px-3.5 h-9.5",
            error ? "border-error-maindark" : "border-border-gray",
            triggerClassName
          )}
        >
          <button
            type="button"
            disabled={disabled}
            className="flex w-full items-center justify-between text-left text-gray-700 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className={cn(
                value ? "text-gray-900 w-full" : "text-gray-400 w-full text-md"
              )}
            >
              {value || placeholder || "HH:MM AM"}
            </span>
            <ClockIcon className="text-text-primary ml-2" size={16} />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-auto rounded-md p-2 shadow-md border border-gray-300 bg-white"
        >
          <div className="flex items-start gap-2">
            {/* Hours */}
            <div
              ref={hourRef}
              className="flex flex-col max-h-[160px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {hours.map((h) => (
                <button
                  key={h}
                  data-hour={h}
                  onClick={() => handleSelect(h, minute, ampm)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm hover:bg-primary/10 hover:text-gray-400",
                    h === hour && "bg-primary text-white"
                  )}
                >
                  {String(h).padStart(2, "0")}
                </button>
              ))}
            </div>

            {/* Minutes */}
            <div
              ref={minuteRef}
              className="flex flex-col max-h-[160px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {minutes.map((m) => (
                <button
                  key={m}
                  data-minute={m}
                  onClick={() => handleSelect(hour, m, ampm)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm hover:bg-primary/10 hover:text-gray-400",
                    m === minute && "bg-primary text-white"
                  )}
                >
                  {String(m).padStart(2, "0")}
                </button>
              ))}
            </div>

            {/* AM/PM */}
            <div className="flex flex-col gap-1">
              {["AM", "PM"].map((p) => (
                <button
                  key={p}
                  onClick={() => handleSelect(hour, minute, p as "AM" | "PM")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm hover:bg-primary/10 hover:text-gray-400",
                    ampm === p && "bg-primary text-white"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { Calendar, CalendarDayButton, DatePicker, CustomTimePicker };
