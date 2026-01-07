import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { ITextAreaProps } from "../types";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent  shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[0px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ",
        className
      )}
      {...props}
    />
  );
}

const FormTextArea: React.FC<ITextAreaProps> = ({
  className,
  name,
  error,
  label,
  onChange,
  placeholder,
  required,
  value,
  inputClass,
  readOnly = false,
  labelClassName,
  innerClassName,
  disabled = false,
  maxLength,
  subTitle,
  rows = 2,
}) => {
  return (
    <div className={className}>
      {label && (
        <div className="flex">
          <Label
            className={cn(
              "mb-2 text-md leading-lg font-medium text-text-primary block font-nunito",
              labelClassName
            )}
          >
            {label}:
          </Label>
          {required && (
            <span className="inline-block pb-1.5 pl-1 text-sm text-error-maindark">
              *
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "flex items-center border border-border-gray bg-white rounded-[5.6px]",
          innerClassName,
          error ? "border-error-maindark" : "border-border-gray"
        )}
      >
        <Textarea
          className={cn(
            "w-full border-none shadow-transparent !text-md",
            inputClass
          )}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
        />
      </div>
      {subTitle && <div className="text-xs text-gray-700">{subTitle}</div>}
      {error && (
        <div className={cn("text-[12px] text-error-maindark")}>{error}</div>
      )}
    </div>
  );
};

export { Textarea, FormTextArea };
