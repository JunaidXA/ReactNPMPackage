import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { FormRadioProps } from "../types";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2 id", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "h-4 w-4 rounded-full border border-gray-400/80 bg-white",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2 w-2 fill-white text-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const FormRadio: React.FC<FormRadioProps> = ({
  label,
  value,
  className,
  radioClassName,
  labelClassName,
  disabled,
}) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <RadioGroupItem
        value={value}
        id={value}
        className={radioClassName}
        disabled={disabled}
      />
      <Label
        htmlFor={value}
        className={cn(
          "cursor-pointer text-md font-normal text-gray-700",
          labelClassName
        )}
      >
        {label}
      </Label>
    </div>
  );
};

export { RadioGroup, RadioGroupItem, FormRadio };
