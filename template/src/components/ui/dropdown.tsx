import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { createContext, useContext } from "react";

const DropdownContext = createContext<{ closeDropdown: () => void } | undefined>(undefined);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("DropdownItem must be used within a Dropdown");
  return context;
};

type DropdownProps = {
  triggerText?: string;
  triggerIcon?: React.ReactNode; // override default icon if needed
  triggerLeftIcon?: React.ReactNode;
  triggerClassName?: string;
  children: React.ReactNode;
  className?: string; // class for dropdown content
  align?: "left" | "right";
};

export const Dropdown: React.FC<DropdownProps> = ({
  triggerText = "Select",
  triggerIcon,
  triggerLeftIcon,
  triggerClassName,
  children,
  className,
  align = "left",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm shadow-sm hover:bg-gray-50",
          triggerClassName
        )}
      >
        {triggerLeftIcon && <span className="mr-1">{triggerLeftIcon}</span>}
        <span>{triggerText}</span>
        {triggerIcon ?? <ChevronDown className="h-4 w-4" />}
      </button>

      {open && (
        <DropdownContext.Provider value={{ closeDropdown: () => setOpen(false) }}>
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[5rem] rounded-md bg-white shadow-lg border border-gray-300 text-sm",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {children}
        </div>
      </DropdownContext.Provider>
      )}
    </div>
  );
};

type DropdownItemProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  className,
  disabled,
}) => {
  const { closeDropdown } = useDropdown();
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    closeDropdown();
  };
  return (
    <div
      onClick={handleClick}
      className={cn(
        "px-4 py-2 hover:bg-gray-100 cursor-pointer transition-all",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </div>
  );
};
