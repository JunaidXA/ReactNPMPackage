// components/common/icon-button.tsx
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
  AlertProps,
  EntityStatusConfirmationDialogProps,
  ExtendedOption,
  IconButtonProps,
  SidedrawerProps,
} from "../types";
import { CustomTooltip } from "./tooltip";
import { Button } from "./button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { formatNullValue } from "@/helper";
import { NotificationModal } from "./dialog";
import { BadgeCheck, TriangleAlert } from "lucide-react";

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  className = "",
  disabled = false,
  icon,
  text,
  tooltipContent,
  tooltipSide = "top",
  type = "button",
}) => {
  const button = (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        className
      )}
    >
      {icon && <span>{icon}</span>}
      {text && <span>{text}</span>}
    </button>
  );

  return (
    <CustomTooltip
      content={tooltipContent}
      side={tooltipSide}
      className="bg-black text-white"
    >
      {button}
    </CustomTooltip>
  );
};

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="whirly-loader"></div>
    </div>
  );
};

const Alert: React.FC<AlertProps> = ({
  icon,
  iconColor,
  bgColor,
  children,
}) => {
  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setShouldRender(false), 150);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`relative rounded-lg ${bgColor} ${iconColor} text-sm font-nunito px-4 py-2 flex justify-between items-center transition-opacity duration-150 ease-linear ${visible ? "opacity-100" : "opacity-0"
        }`}
      role="alert"
    >
      <div className="flex items-center justify-center">
        <i className={`${icon}  text-base me-2 mt-1`}></i>
        <div className="mt-1">{children}</div>
      </div>
      <Button
        type="button"
        variant={"default"}
        className="text-gray-500 hover:text-gray-700 shadow-none bg-transparent"
        onClick={handleClose}
      >
        <i className="ti ti-x text-base" />
      </Button>
    </div>
  );
};

const Sidedrawer: React.FC<SidedrawerProps> = ({
  triggerText = "Open Drawer",
  content,
  bgColor = "bg-white",
  direction = "right", // can be used if supported by Drawer
}) => {
  return (
    <Drawer direction={direction}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl bg-gradient-to-r bg-primary-300 text-white px-6 py-2 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
        >
          {triggerText}
        </Button>
      </DrawerTrigger>
      <DrawerContent className={`${bgColor}`}>
        {content && <div className="p-4">{content}</div>}
      </DrawerContent>
    </Drawer>
  );
};

const RenderDetails = (items: ExtendedOption[], mainClassName?: string) => (
  <div className={cn("space-y text-start", mainClassName)}>
    {items.map((item, index) => (
      <h1 key={index}>
        <span className={cn("font-bold", item.className)}>{item.label}:</span>{" "}
        {formatNullValue(item.value)}
      </h1>
    ))}
  </div>
);

const EntityStatusConfirmationDialog: React.FC<
  EntityStatusConfirmationDialogProps
> = ({
  actionState,
  setActionState,
  warningIcon,
  handleWarningAction,
  warningDialogClassName,
  warningTitle,
  warningCancelButtonText,
  warningConfirmButtonLoading,
  warningConfirmButtonText,
  warningCancelButtonClassName,
  warningSubTitle,
  setSuccess,
  successState,
  successDialogClassName,
  successIcon,
  successTitle,
  apiError,
  setApiError,
  apiErrorIcon,
  apiErrorTitle,
}) => {
    React.useEffect(() => {
      if (successState.open) {
        const timer = setTimeout(() => {
          setSuccess({ message: "", open: false });
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [successState.open, setSuccess]);
    return (
      <>
        <NotificationModal
          open={actionState.open}
          setOpen={() => {
            setActionState({ id: "", open: false, type: "" });
          }}
          title={warningTitle}
          dialogClassName={warningDialogClassName}
          icon={warningIcon ?? <TriangleAlert className="text-yellow-300" />}
          onConfirmClick={() =>
            handleWarningAction(actionState?.type, actionState?.id)
          }
          confirmButtonText={warningConfirmButtonText ?? "Confirm"}
          cancelButtonClassName={
            warningCancelButtonClassName ?? "!border border-gray-400"
          }
          cancelButtonText={warningCancelButtonText ?? "Cancel"}
          confirmButtonLoading={warningConfirmButtonLoading}
          subtitle={warningSubTitle}
        />
        <NotificationModal
          open={successState.open}
          setOpen={() => {
            setSuccess({ message: "", open: false });
          }}
          title={successTitle ?? "Success"}
          dialogClassName={successDialogClassName ?? "border-green-500"}
          icon={successIcon ?? <BadgeCheck className="text-green-500" />}
          subtitle={successState.message}
        />
        <NotificationModal
          open={Boolean(apiError)}
          setOpen={() => {
            setApiError("");
          }}
          title={apiErrorTitle ?? "Error"}
          icon={apiErrorIcon ?? <TriangleAlert className="text-red-500" />}
          subtitle={apiError}
        />
      </>
    );
  };

interface ProgressBarProps {
  label: string;
  color: string;
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, color, percentage }) => {
  return (
    <div className="flex items-center gap-3 mb-3 last:mb-0">
      <span className="text-sm text-gray-600 w-16">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-12 text-right">
        {percentage}%
      </span>
    </div>
  );
};

export {
  IconButton,
  Loader,
  Alert,
  Sidedrawer,
  RenderDetails,
  EntityStatusConfirmationDialog,
  ProgressBar
};
