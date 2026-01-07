import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  Check,
  CheckIcon,
  ChevronDown,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { CustomSelectProps, MultiSelectProps, RowPerPageProps } from "../types";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Button } from "./button";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "font-nunito bg-white border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap  transition-[color,box-shadow] outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9.5 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-white z-[2000] border-gray-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative  max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        {/* <SelectScrollUpButton /> */}
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full  scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        {/* <SelectScrollDownButton /> */}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

const getOptions = (rowLength: number) => {
  const options = [5, 10, 25, 50, 100].filter((num) => num <= rowLength);
  return [...options.map(String), "All"];
};

const RowPerPage: React.FC<RowPerPageProps> = ({
  value,
  onValueChange,
  rowLength,
  currentPage,
  onPageChange,
  triggerClassName,
  label,
}) => {
  const options = getOptions(rowLength);
  const totalPages =
    value === "All" ? 1 : Math.ceil(rowLength / parseInt(value));

  const handleRowsPerPageChange = (val: string) => {
    onValueChange(val);
    onPageChange(1);
  };
  return (
    <div>
      <div className="flex flex-col space-y-1">
        {" "}
        {label && (
          <label className="text-gray-600 font-medium">{label}</label>
        )}{" "}
        <Select value={value} onValueChange={handleRowsPerPageChange}>
          <SelectTrigger
            className={cn(
              "h-auto w-max rounded-lg border-2 border-gray-200 bg-white py-2 pl-3.5 pr-4 text-base text-gray-500 focus:outline-none focus:ring-0 focus:ring-gray-300",
              triggerClassName
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-gray-200 bg-error-maindark pb-1">
            {options.map((option, index) => (
              <SelectItem
                key={index}
                value={option}
                className="w-full text-base text-gray-500 hover:text-white focus:bg-primary-500 focus:text-white"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          Frist
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  );
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  label,
  onChange,
  itemClassName,
  triggerClassName,
  labelClassName,
  className,
  required,
  innerClassName,
  subTitle,
  error,
  icon,
  isDisabled,
  placeholder,
}) => {
  const handleSelectChange = (val: string | number) => {
    onChange(Number(val));
  };
  return (
    <div className={cn(className, "")}>
      <div className="flex">
        {label && (
          <Label
            className={cn(
              "mb-2 text-md leading-lg font-medium text-black block",
              labelClassName
            )}
          >
            {label}
          </Label>
        )}
        {required && (
          <span className="inline-block pb-1.5 pl-1 text-sm text-error-maindark">
            *
          </span>
        )}
      </div>
      <div className={cn("flex flex-col items-start ", innerClassName)}>
        <Select value={value} onValueChange={handleSelectChange}>
          <SelectTrigger
            disabled={isDisabled}
            className={cn(
              "!h-9.5 w-full  py-3 pl-3.5 pr-4 font-nunito text-[16px] focus:outline-none focus:ring-0 focus:ring-gray-300",
              "flex items-center border  bg-white rounded-[5.6px]",
              value ? "text-black" : "text-gray-500",
              triggerClassName,
              error ? "border-error-maindark" : "border-border-gray"
            )}
          >
            {icon && <span className="">{icon}</span>}
            {value ? <SelectValue /> : placeholder || "Select Value"}
          </SelectTrigger>
          <SelectContent className="z-[2000] sm:max-w-[var(--radix-select-trigger-width)] md:min-w-[var(--radix-select-trigger-width)] max-h-80 rounded-lg border-gray-200 bg-white pb-1">
            <SelectGroup className="w-full">
              {options?.length > 0 ? (
                <>
                  {options?.map((option, index) => (
                    <SelectItem
                      key={index}
                      value={option.value}
                      className={cn(
                        "w-full px-3 py-2 text-md text-gray-500 !hover:text-primary-700 focus:bg-primary focus:text-white",
                        itemClassName
                      )}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </>
              ) : (
                <SelectItem value="nodata">No Data</SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        {subTitle && <div className="text-xs text-gray-700">{subTitle}</div>}
        {error && (
          <div className={cn("text-[12px] text-error-maindark")}>{error}</div>
        )}
      </div>
    </div>
  );
};

export const CustomAutocompleteSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  label,
  onChange,
  itemClassName,
  triggerClassName,
  labelClassName,
  className,
  required,
  innerClassName,
  subTitle,
  error,
  isDisabled,
  placeholder,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleSelect = (currentValue: string) => {
    onChange(currentValue);
    setOpen(false);
  };

  return (
    <div className={cn(className)}>
      <div className="flex items-center">
        {label && (
          <Label
            className={cn(
              "mb-2 text-md leading-lg font-medium text-text-primary block",
              labelClassName
            )}
          >
            {label}
          </Label>
        )}
        {required && (
          <span className="inline-block pb-1.5 pl-1 text-sm text-primary-500">
            *
          </span>
        )}
      </div>
      <div className={cn("flex flex-col items-start ", innerClassName)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            disabled={isDisabled}
            // asChild
            className={cn(
              "h-10 w-max !text-md font-nunito text-base text-gray-500 focus:outline-none focus:ring-0 focus:ring-gray-300",
              "flex items-center justify-between border border-border-gray bg-white rounded-[5.6px]",
              triggerClassName,
              value ? "text-white bg-primary" : "text-gray-500",
              isDisabled
                ? "cursor-not-allowed"
                : "hover:bg-primary hover:text-white hover:cursor-pointer"
            )}
          >
            {value
              ? options.find((option) => option.value === value)?.label ||
                "Select Value"
              : placeholder}
            <i className="ti ti-chevron-down" />
          </PopoverTrigger>
          <PopoverContent
            className="w-full !min-w-[var(--radix-popover-trigger-width)] max-h-80 rounded-lg border-gray-200 bg-white p-2 overflow-y-auto"
            align="start"
          >
            <Command className="!w-full">
              <CommandInput
                placeholder="Search..."
                className="h-9 p-0 w-full"
              />
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="w-full">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 text-md text-gray-500  focus:text-white",
                      itemClassName
                    )}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {subTitle && <div className="text-xs text-gray-700">{subTitle}</div>}
        {error && <div className={cn("text-[12px] text-red-500")}>{error}</div>}
      </div>
    </div>
  );
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
  error,
  icon,
  innerClassName,
  itemClassName,
  label,
  labelClassName,
  required,
  subTitle,
  triggerClassName,
  disabled,
}) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const handleSelect = (value: string) => {
    const option = options.find((opt) => opt.value === value);
    if (option) {
      const isSelected = selected.some((item) => item.value === value);
      const newSelected = isSelected
        ? selected.filter((item) => item.value !== value)
        : [...selected, option];
      onChange(newSelected);
    }
  };

  const handleRemove = (value: string) => {
    const newSelected = selected.filter((item) => item.value !== value);
    onChange(newSelected);
  };

  const filteredOptions = options?.filter((option) =>
    option?.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={className}>
      <div className="flex items-center">
        {label && (
          <Label
            className={cn(
              "mb-2 text-md leading-lg font-medium text-text-primary block",
              labelClassName
            )}
          >
            {label}:
          </Label>
        )}
        {required && (
          <span className="inline-block pb-1.5 pl-1 text-sm text-error-maindark">
            *
          </span>
        )}
      </div>
      <div className={cn("flex flex-col items-start ", innerClassName)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            asChild
            disabled={disabled}
            className={cn(
              " min-h-9.5 w-max text-md text-gray-500 shadow-none focus:outline-none focus:ring-0 focus:ring-gray-300",
              "flex items-center justify-between border  bg-white rounded-[5.6px]",
              triggerClassName,
              error ? "border-error-maindark" : "border-border-gray"
            )}
          >
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between px-3.5 !py-0"
            >
              <div className="flex flex-wrap gap-2 py-1 max-w-[90%]">
                {selected.length > 0 ? (
                  selected.map((item) => (
                    <span
                      key={item.value}
                      className="inline-flex items-center px-2 rounded-full bg-primary/10 text-sm"
                    >
                      {item.label}
                      <span
                        className="ml-1 text-primary hover:text-primary/80"
                        onClick={() => {
                          handleRemove(item.value);
                        }}
                      >
                        ×
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="text-text-secondary">{placeholder}</span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 " />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="z-[2000]  w-[var(--radix-popover-trigger-width)] max-h-80 rounded-lg border-gray-200 bg-white p-2"
          >
            <Command className="!w-full">
              <CommandInput
                placeholder="Search..."
                value={inputValue}
                onValueChange={setInputValue}
                className="h-9 p-0 w-full "
              />
              <CommandList className="max-h-[200px] my-3 scrollbar-hide overflow-y-auto w-full text-text-primary">
                {filteredOptions.length === 0 && (
                  <CommandEmpty>No options found.</CommandEmpty>
                )}
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className={cn(
                      "flex items-center  justify-between w-full px-3 py-2 text-base text-gray-500  focus:text-white",
                      itemClassName
                    )}
                  >
                    {option.label}
                    {icon ?? (
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected.some((item) => item.value === option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    )}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {subTitle && <div className="text-xs text-gray-700">{subTitle}</div>}
        {error && (
          <div className={cn("text-[12px] text-error-maindark")}>{error}</div>
        )}
      </div>
    </div>
  );
};

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  RowPerPage,
  CustomSelect,
};
