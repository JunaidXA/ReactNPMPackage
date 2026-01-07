import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { SimpleAccordionProps } from "../types";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all cursor-pointer outline-none focus-visible:ring-[0px] disabled:pointer-events-none disabled:opacity-50 duration-1000 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn("radix-accordion-content text-sm", className)}
      {...props}
    >
      <div className={cn(className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

const SimpleAccordion: React.FC<SimpleAccordionProps> = ({
  items,
  defaultOpenId,
  triggerClassName
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="space-y-2"
      defaultValue={defaultOpenId ? `item-${defaultOpenId}` : undefined} // Set default open item based on defaultOpenId
    >
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={`item-${item.id}`} // Use item.id for unique value
          className="border border-gray-200 rounded p-0 bg-white"
        >
          <AccordionTrigger className={cn("text-base font-semibold px-4 transition-all duration-1000", triggerClassName)}>
            <div className="flex gap-2 items-center">
              <span>{item.icon}</span>
              <span>{item.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="transition-all duration-1000">
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  SimpleAccordion,
};
