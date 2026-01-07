import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";
import { CustomTooltipProps, TooltipProps } from "../types";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, side, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      side={side}
      align="center"
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-md px-3 py-1.5 font-nunito text-sm animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const MyTooltip: React.FC<TooltipProps> = ({
  trigger,
  tag,
  side,
  className,
  open,
  card,
  onOpenChange,
  triggerClassName,
}) => {
  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={onOpenChange}>
        <TooltipTrigger asChild className={triggerClassName}>
          <div>{trigger}</div>
        </TooltipTrigger>
        {(tag || card) && (
          <TooltipContent className={className} side={side}>
            {tag || card}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  children,
  content,
  side = "top",
  className,
}) => {
  if (!content) return <>{children}</>;

  // 🔁 Arrow styles based on side
  const arrowPosition = {
    top: "-bottom-1 left-1/2 -translate-x-1/2 rotate-45",
    bottom: "-top-1 left-1/2 -translate-x-1/2 rotate-45",
    left: "-right-1 top-1/2 -translate-y-1/2 rotate-45",
    right: "-left-1 top-1/2 -translate-y-1/2 rotate-45",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className={cn("relative", className)}>
          {content}
          <span
            className={cn(
              "absolute w-2 h-2 bg-black",
              arrowPosition[side as keyof typeof arrowPosition]
            )}
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  MyTooltip,
  CustomTooltip,
};
