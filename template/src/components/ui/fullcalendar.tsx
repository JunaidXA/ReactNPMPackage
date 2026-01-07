import { memo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarDays, AlertTriangle, X } from "lucide-react";
import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";
import { ICalendarSidebarProps, ICalendarViewProps, IPageCalendarProps } from "../types";

export const CalendarView = memo<ICalendarViewProps>(({ events, config, className }) => {
  const defaultConfig = {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,dayGridWeek,dayGridDay",
    },
    height: "auto",
    dayMaxEvents: 3,
    moreLinkClick: "popover",
    eventDisplay: "block",
    displayEventTime: true,
    eventBackgroundColor: "#26dc87",
    eventBorderColor: "#26dc87",
    eventTextColor: "#ffffff",
    selectable: false,
    selectMirror: false,
    dayHeaderClassNames: "bg-gray-50 text-gray-700 font-semibold",
    viewClassNames: "border border-gray-200 rounded-lg",
    ...config,
  };

  return (
    <div className={`bg-white rounded-sm shadow-xs ${className || ""}`}>
      <div className="p-6">
        <div className="calendar-grid">
          <FullCalendar plugins={[dayGridPlugin, interactionPlugin]} events={events} {...defaultConfig} displayEventTime={false} eventClassNames={"px-2"} />
        </div>
      </div>
    </div>
  );
});

export const CalendarSidebar = memo<ICalendarSidebarProps>(
  ({
    config,
    selectedDate,
    onDateChange,
    quickActions,
    upcomingEvents = [],
    CurrentEvents = [],
    stats,
    formatDateTime,
    sidebarClassName,
    // onEdit,
    onDelete,
  }) => {
    const defaultFormatDateTime = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const formatFn = formatDateTime || defaultFormatDateTime;

    return (
      <div className={cn("w-80 shrink-0", sidebarClassName)}>
        <div className="bg-white rounded-sm shadow-xs">
          <div className="p-4 space-y-6">
            {/* Date Picker */}
            {config.showDatePicker && (
              <div className="border-b pb-4">
                <Calendar mode="single" selected={selectedDate} onSelect={onDateChange} className="rounded-md w-full" captionLayout="dropdown" />
              </div>
            )}

            {/* Quick Actions */}
            {config.showQuickActions && quickActions && quickActions.length > 0 && (
              <div className="border-b pb-4 flex items-center justify-between">
                <div className="flex items-center justify-between ">
                  <h5 className="font-semibold text-gray-900">Blackouts</h5>
                </div>
                <div className="">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={action.onClick}
                      className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${action.className || "bg-primary text-white hover:bg-primary/90"}`}
                    >
                      {action.icon}
                      {/* {action.label} */}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {config.showUpcomingEvents && (
              <div className="border-b pb-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CalendarDays size={16} />
                  Upcoming Events
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{upcomingEvents.length}</span>
                </h5>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.slice(0, 5).map((event, index) => (
                      <div key={event.id || index} className="border-l-4 border-green-500 pl-3">
                        <h6 className="font-medium text-sm text-gray-900 mb-1">{event.title || "Event"}</h6>
                        <p className="text-xs text-gray-600 mb-1">
                          {formatFn(event.start)} - {formatFn(event.end)}
                        </p>
                        {event.description && <p className="text-xs text-gray-500 truncate">{event.description}</p>}
                        {event.createdBy && <p className="text-xs text-gray-400">Created by: {event.createdBy}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No upcoming events</p>
                )}
              </div>
            )}

            {config.showCurrentEvents && (
              <div className={cn(config.showStats && "border-b", "pb-4")}>
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CalendarDays size={16} />
                  Current Blackouts
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{CurrentEvents?.length}</span>
                </h5>
                {CurrentEvents?.length > 0 ? (
                  <div className="space-y-3">
                    {CurrentEvents?.slice(0, 5).map((event, index) => (
                      <div key={event.id || index} className="flex">
                        <div className="border-l-4 border-green-500 pl-3">
                          <h6 className="font-medium text-sm text-gray-900 mb-1">{event.title || "Event"}</h6>
                          <p className="text-xs text-gray-600 mb-1">
                            {formatFn(event.start)} - {formatFn(event.end)}
                          </p>
                          {event.description && <p className="text-xs text-gray-500 truncate">{event.description}</p>}
                          {event.createdBy && <p className="text-xs text-gray-400">Created by: {event.createdBy}</p>}
                        </div>
                        <div className="space-y-2">
                          {/* <button
                            onClick={() =>
                              onEdit?.({
                                ...event,
                                TimeSlotId: parseInt(event.id),
                              })
                            }
                            className="w-fit flex items-center justify-center gap-2 p-2 rounded-md transition-colors bg-primary text-white hover:bg-primary/90"
                          >
                            <Pencil size={10} />
                          </button> */}
                          <button
                            onClick={() => onDelete?.(parseInt(event.id))}
                            className="w-fit flex items-center justify-center cursor-pointer gap-2 p-2 rounded-md transition-colors bg-red-500 text-white hover:bg-red-500/90"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No Current blackouts</p>
                )}
              </div>
            )}

            {/* Stats */}
            {config.showStats && stats && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <h6 className="font-medium text-gray-900">Statistics</h6>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-xs text-gray-600">Total Events</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">{stats.upcoming}</div>
                    <div className="text-xs text-gray-600">Upcoming</div>
                  </div>
                </div>
                {stats.custom && stats.custom.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    {stats.custom.map((stat, index) => (
                      <div key={index} className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">{stat.label}</span>
                        <span className={`text-xs font-medium ${stat.color || "text-gray-900"}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Custom Sections */}
            {config.customSections?.map((section) => (
              <div key={section.id} className={`border-b pb-4 ${section.className || ""}`}>
                <div className="flex items-center gap-2 mb-3">
                  {section.icon}
                  <h5 className="font-semibold text-gray-900">{section.title}</h5>
                </div>
                {section.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

const PageCalendar: React.FC<IPageCalendarProps> = ({
  events,
  calendarConfig,
  sidebarConfig,
  quickActions,
  upcomingEvents,
  stats,
  className,
  sidebarClassName,
  calendarClassName,
  onDateChange,
  formatDateTime,
  currentEvents,
  onEdit,
  onDelete,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateChange?.(date);
  };

  const defaultSidebarConfig = {
    showDatePicker: false,
    showQuickActions: true,
    showUpcomingEvents: false,
    showStats: false,
    ...sidebarConfig,
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      <div className="flex gap-6  bg-gray-50 min-h-screen">
        {sidebarConfig && (
          <CalendarSidebar
            CurrentEvents={currentEvents}
            config={defaultSidebarConfig}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            quickActions={quickActions}
            upcomingEvents={upcomingEvents}
            stats={stats}
            formatDateTime={formatDateTime}
            sidebarClassName={sidebarClassName}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}

        <div className="flex-1">
          <CalendarView events={events} config={calendarConfig || {}} className={calendarClassName} />
        </div>
      </div>
    </div>
  );
};

export default memo(PageCalendar);
