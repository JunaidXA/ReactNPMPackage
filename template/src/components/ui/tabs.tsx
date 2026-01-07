import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex items-center justify-center rounded-lg p-[3px]", // base styles
        className // <- merge incoming classes
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

interface BottomLineTabsProps {
  tabs: {
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
  }[];
  mainTabContainerClassName?: string;
  tabListContainerCLassName?: string;
  tabTriggerClassName?: string;
  tabContentClassName?: string;
  activeTab?: number;
  onTabChange?: (index: number) => void;
}

function BottomLineTabs({
  tabs,
  activeTab,
  onTabChange,
  mainTabContainerClassName,
  tabListContainerCLassName,
  tabTriggerClassName,
  tabContentClassName,
}: BottomLineTabsProps) {
  const activeTabLabel =
    activeTab !== undefined ? tabs?.[activeTab]?.label : undefined;

  return (
    <Tabs
      value={activeTabLabel} // controlled if activeTab exists
      defaultValue={tabs?.[0]?.label} // fallback to uncontrolled mode
      onValueChange={(label) => {
        if (onTabChange) {
          const index = tabs.findIndex((tab) => tab.label === label);
          onTabChange(index);
        }
      }}
      className={cn("", mainTabContainerClassName)}
    >
      <TabsList
        className={cn(
          " bg-white p-0 rounded-sm m-0 ",
          tabListContainerCLassName
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.label}
            value={tab.label}
            className={cn(
              " tabs-trigger hover-after-shift relative w-full py-3 text-[16px] font-bold text-gray-500 mt-3  border-b border-gray-200 hover:text-primary data-[state=active]:text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-primary after:w-0 hover:after:w-auto data-[state=active]:after:w-auto transition-all duration-1000",
              tabTriggerClassName,
              tab.disabled
                ? "text-neutral-200 hover:text-neutral-200 pointer-events-none"
                : "hover:text-primary"
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.label}
          value={tab.label}
          className={cn("pt-2", tabContentClassName)}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, BottomLineTabs };
