import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Button } from "./button";
import {
  CheckBoxWithLabelProps,
  FormSwitchProps,
  IImageInputProps,
  IInputProps,
  OTPInputProps,
} from "../types";
import { Checkbox } from "./checkbox";
import { SearchIcon } from "lucide-react";
import { Switch } from "./switch";
import { CustomTimePicker, DatePicker } from "./calendar";
import { ProfileAvatar } from "./avatar";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const FormInput: React.FC<IInputProps> = ({
  className,
  name,
  error,
  label,
  pre,
  post,
  onChange,
  placeholder,
  required,
  type = "text",
  value,
  inputClass,
  readOnly = false,
  labelClassName,
  innerClassName,
  disabled = false,
  maxLength,
  subTitle,
  minDate,
  onKeyDown,
  pattern,
}) => {
  const [inputType, setInputType] = React.useState<string>(type);
  const togglePasswordVisibility = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };
  const today = new Date().toISOString().split("T")[0];

  const isPassword = type === "password";

  const isNumber = type === "number";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) return onKeyDown(e); // use custom if provided

    if (isNumber) {
      const allowedKeys = [
        "Backspace",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "Delete",
        "-",
        ".",
        "+"
      ];
      if (
        allowedKeys.includes(e.key) ||
        ((e.ctrlKey || e.metaKey) &&
          ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
      ) {
        return;
      }

      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    }
  };
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
          error ? "border-red-500" : "border-border-gray"
        )}
      >
        {pre && <span className="">{pre}</span>}
        <Input
          className={cn(
            "w-full border-none shadow-transparent text-black text-md",
            inputClass
          )}
          type={inputType}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          maxLength={maxLength}
          onKeyDown={handleKeyDown}
          min={inputType === "date" ? minDate || today : undefined}
          pattern={pattern}
        />
        {post && <span className="">{post}</span>}
        {isPassword && (
          <Button
            type="button"
            className=""
            variant="eyeIcon"
            size="icon"
            color={"neutral"}
            onClick={togglePasswordVisibility}
          >
            {inputType === "password" ? (
              <i className="ti ti-eye text-lg text-text-primary"></i>
            ) : (
              <i className="ti ti-eye-off text-lg text-text-primary"></i>
            )}
          </Button>
        )}
      </div>
      {subTitle && <div className="text-xs text-gray-700">{subTitle}</div>}
      {error && (
        <div className={cn("text-[12px] text-error-maindark")}>{error}</div>
      )}
    </div>
  );
};

const FormCheckbox: React.FC<CheckBoxWithLabelProps> = ({
  checked = false,
  label,
  onChange,
  className,
  labelClassName,
  disabled,
  labelText,
  error,
  checkboxClassName,
}) => {
  return (
    <div>
      <div
        className={cn(
          "flex cursor-pointer items-center justify-start gap-2",
          className
        )}
      >
        <Checkbox
          id={label}
          onCheckedChange={onChange}
          checked={checked}
          disabled={disabled}
          className={checkboxClassName}
        />
        <Label
          className={cn(
            "block cursor-pointer text-md font-normal text-black font-nunito leading-normal",
            labelClassName
          )}
          htmlFor={label}
        >
          {label}
          {labelText && <span>{labelText}</span>}
        </Label>
      </div>
      {error && <div className={cn("text-[12px] text-red-500")}>{error}</div>}
    </div>
  );
};

interface DateInputProps {
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  label?: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  disableDate?: Date;
  error?: string;
  dateRangeMode?: "singleYear" | "custom" | "unlimited" | "fromStart";
  minDate?: Date;
  maxDate?: Date;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  className,
  labelClassName,
  inputClassName,
  disabled,
  required,
  placeholder,
  disableDate,
  error,
  dateRangeMode,
  minDate,
  maxDate,
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
            {label}
          </Label>
          {required && (
            <span className="inline-block pb-1.5 pl-1 text-sm text-error-maindark">
              *
            </span>
          )}
        </div>
      )}
      <DatePicker
        triggerClassName={inputClassName}
        placeholder={placeholder}
        value={value}
        onDateChange={onChange}
        disabled={disabled}
        disableDate={disableDate}
        error={error}
        minDate={minDate}
        maxDate={maxDate}
        dateRangeMode={dateRangeMode}
      />
      {error && (
        <div className={cn("text-[12px] text-error-maindark")}>{error}</div>
      )}
    </div>
  );
};

const SearchInput: React.FC<IInputProps> = ({
  className,
  name,
  pre,
  post,
  onChange,
  placeholder,
  value,
  inputClass,
  readOnly = false,
  innerClassName,
  disabled = false,
  maxLength,
  inputType,
  btnClassName,
  onKeyDown,
  onButtonClick,
  buttonDisabled,
}) => {
  return (
    <div className={className}>
      <div
        className={cn(
          "flex items-center border border-[#ced4da] bg-[#f8f9fa] ",
          innerClassName
        )}
      >
        {pre && <span className="pl-3">{pre}</span>}
        <Input
          className={cn("w-full border-none shadow-transparent", inputClass)}
          type={inputType}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          maxLength={maxLength}
          onKeyDown={onKeyDown}
        />
        {post && <span className="pr-3">{post}</span>}
      </div>
      <div className="">
        <Button
          variant="addItem"
          pre={<SearchIcon />}
          className={cn("", btnClassName)}
          onClick={onButtonClick}
          disabled={buttonDisabled}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

const OTPInput: React.FC<OTPInputProps> = ({ onChange }) => {
  const [otp, setOtp] = React.useState<string[]>(Array(6).fill(""));
  // Properly type the ref as an array of HTMLInputElement or null
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>(
    Array(6).fill(null)
  );

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    onChange(newOtp.join(""));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pastedData.forEach((value, index) => {
      if (index < 6 && !isNaN(Number(value))) {
        newOtp[index] = value;
      }
    });
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    onChange(newOtp.join(""));
  };

  return (
    <div className="flex justify-center items-center">
      {otp.map((digit, index) => (
        <React.Fragment key={index}>
          <input
            ref={(el: any) => (inputRefs.current[index] = el)} // Type-safe ref assignment
            className={cn(
              "w-8 h-8 rounded sm:w-12 sm:h-12 border-2 sm:rounded-lg bg-background-surface text-center sm:text-xl text-sm focus:outline-none mx-1 !sm:px-3 !sm:py-3 !px-2 !py-2 input-scroll"
            )}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target, index)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              handleKeyDown(e, index)
            }
            onPaste={handlePaste}
          />
          {index === 2 && (
            <span className="text-2xl text-grey-200 mx-1">-</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export const FormSwitch: React.FC<FormSwitchProps> = ({
  name,
  checked,
  onCheckedChange,
  label,
  disabled,
  className,
  labelClassName,
  error,
  switchClassName,
}) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className={cn("flex items-center gap-2", switchClassName)}>
        <Switch
          id={name}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
        {label && (
          <Label htmlFor={name} className={cn("", labelClassName)}>
            {label}
          </Label>
        )}
      </div>
      {error && <div className="text-[12px] text-red-500">{error}</div>}
    </div>
  );
};

const ImageInput: React.FC<IImageInputProps> = ({
  name,
  label,
  required,
  error,
  value,
  onChange,
  className,
  labelClassName,
  subTitle,
  disabled,
  maxFileSize = 4,
  fallBack,
  avatarClassName = "rounded-lg",
}) => {
  const [profileImage, setProfileImage] = useState<string>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size < maxFileSize * 1024 * 1024) {
      // 4MB limit
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        if (name && onChange) {
          onChange(name, file);
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (name && onChange) {
        onChange(name, null);
      }
    }
  };

  const handleCancel = () => {
    setProfileImage(value);
    if (name && onChange) {
      onChange(name, null);
    }
  };

  return (
    <div className={cn(" flex items-center space-x-4 mb-6", className)}>
      <ProfileAvatar
        src={profileImage}
        fallback={fallBack}
        avatarClassname={cn(
          "w-20 h-20 border-2 border-border-gray ",
          avatarClassName
        )}
      />
      <div className="flex-1">
        <div className="flex">
          <Label
            className={cn(
              "font-bold text-md text-text-primary ",
              labelClassName
            )}
          >
            {label}
          </Label>
          {required && (
            <span className="inline-block pb-1.5 pl-1 text-sm text-primary-500">
              *
            </span>
          )}
        </div>
        {subTitle && <p className="text-xs text-text-secondary">{subTitle}</p>}
        {error && <div className="text-[12px] text-red-500">{error}</div>}
        <div className="mt-2 flex space-x-2 text-sm">
          <Label
            className={cn(
              "bg-primary text-white px-4 rounded cursor-pointer hover:bg-primary/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </Label>
          <Button
            variant="ghost"
            size="sm"
            className=" text-text-primary border-border-gray"
            onClick={handleCancel}
            disabled={disabled}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

interface TimeInputProps {
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  label?: string;
  value?: string; // e.g. "09:00 AM"
  onChange: (time: string | undefined) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  error?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  label,
  value,
  onChange,
  className,
  labelClassName,
  inputClassName,
  disabled,
  required,
  placeholder,
  error,
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
            {label}
          </Label>
          {required && (
            <span className="inline-block pb-1.5 pl-1 text-sm text-error-maindark">
              *
            </span>
          )}
        </div>
      )}
      <CustomTimePicker
        triggerClassName={inputClassName}
        placeholder={placeholder}
        value={value}
        onTimeChange={onChange}
        disabled={disabled}
        error={error}
      />
      {error && (
        <div className={cn("text-[12px] text-error-maindark")}>{error}</div>
      )}
    </div>
  );
};

export {
  Input,
  FormInput,
  FormCheckbox,
  DateInput,
  SearchInput,
  OTPInput,
  ImageInput,
  TimeInput,
};
