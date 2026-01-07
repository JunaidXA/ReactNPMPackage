"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
//import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
//import { useNavigate } from "react-router-dom";
import { emailRegex } from "@/helper";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormInput, OTPInput } from "./input";
import { Button } from "./button";
import { FormGenerator } from "./forms";
import { LinkIcon, ServerCrash, X } from "lucide-react";
import { CloseIcon } from "../svg";
import {
  // AssetDataModalProps,
  IFormModalProps,
  NotificationModalProps,
  OTPModalProps,
} from "../types";
import { Loader } from "./miscellaneous";
import { SimpleTable } from "./table";
import { useCreateDynamicDataWithoutFormDataMutation, useLazyGetOTPQuery } from "@/features/services";
function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn("data-[state=open]:animate-in z-1000 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 bg-black/50", className)}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background z-[1050] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {/* {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className=" data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100  disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )} */}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-lg leading-none font-semibold", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

export interface EmailModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, setIsOpen }) => {
  //const navigate = useNavigate();

  const initialValues = {
    email: "",
  };

  const EmailModalSchema = Yup.object().shape({
    email: Yup.string().matches(emailRegex, "Email is not valid").max(50, "Email is too long!").required("Email is required"),
  });

  const handleEmailModal = async ({ email }: { email: string }) => {
    console.log(email);
  };

  const {
    setFieldValue,
    handleSubmit,
    values,
    errors,
    touched,
    resetForm,
    //setFieldError,
  } = useFormik({
    initialValues,
    onSubmit: (values) => handleEmailModal(values),
    validationSchema: EmailModalSchema,
    enableReinitialize: true,
  });

  React.useEffect(() => {
    resetForm();
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-96 rounded-lg border-border-gray bg-white px-6 py-6">
          <span className="absolute right-4 top-4 cursor-pointer w-6 h-6 bg-background-dark-500 flex items-center justify-center rounded-full" onClick={setIsOpen}>
            <i className="ti ti-x text-white"></i>
          </span>
          <DialogTitle className="text-center font-nunito text-xl font-semibold text-text-primary">Email</DialogTitle>
          <form onSubmit={handleSubmit}>
            <FormInput
              onChange={(e) => {
                setFieldValue("email", e?.target?.value);
              }}
              className="mb-4"
              innerClassName="py-[8px] px-[14px]"
              label="Email"
              value={values.email}
              error={errors.email && touched.email ? errors.email : undefined}
              post={<i className="ti ti-mail"></i>}
              required={true}
            />
            <DialogFooter>
              <Button className="py-1.5 px-3.5 font loginHover" type="submit" variant="solidBtn">
                Send
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

const NotificationModal: React.FC<NotificationModalProps> = ({
  loading = false,
  open,
  setOpen,
  title,
  subtitle,
  icon,
  onConfirmClick,
  cancelButtonText,
  cancelButtoncolor,
  cancelButtonsize = "default",
  cancelButtonvariant = "outline",
  className,
  confirmButtonText,
  confirmButtoncolor = "primary",
  confirmButtonsize = "default",
  confirmButtonvariant = "confirmBtn",
  loadingText = "",
  cancelButtonClassName,
  confirmButtonClassName,
  subTitleClassName,
  titleClassName,
  confirmButtonLoading,
  dialogClassName,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn(className, "focus:outline-none bg-white")}>
        {loading ? (
          <div className="py-20 text-center">
            {/* <MainSpinnerIcon /> */}
            {loadingText && <h1 className="mt-5 text-gray-800">{loadingText}</h1>}
          </div>
        ) : (
          <>
            <CloseIcon onClick={() => setOpen && setOpen(!open)} className="absolute right-6 top-6 cursor-pointer" />
            {/* <div>
              <i className="fas fa-x text-grey-50 text-xs" />
            </div> */}
            <div className="text-center">
              <DialogHeader className={cn("m-auto flex h-12 w-12 items-center justify-center rounded-md border ", dialogClassName)}>{icon}</DialogHeader>
              <DialogTitle className={cn("my-4 text-center text-xl font-bold text-primary-800", titleClassName)}>{title}</DialogTitle>
              <DialogDescription className={cn("my-4 text-center text-base font-semibold text-text-primary", subTitleClassName)}>{subtitle}</DialogDescription>

              <div className="flex items-center justify-center gap-4">
                {confirmButtonText && (
                  <Button
                    className={cn("px-10 py-2.5 font-semibold", confirmButtonClassName)}
                    onClick={onConfirmClick}
                    variant={confirmButtonvariant}
                    color={confirmButtoncolor}
                    size={confirmButtonsize}
                    loading={confirmButtonLoading}
                    disabled={confirmButtonLoading}
                  >
                    {confirmButtonText}
                  </Button>
                )}
                {cancelButtonText && (
                  <Button
                    className={cn("px-10 py-2.5 font-semibold", cancelButtonClassName)}
                    onClick={() => setOpen && setOpen(!open)}
                    variant={cancelButtonvariant}
                    color={cancelButtoncolor}
                    size={cancelButtonsize}
                  >
                    {cancelButtonText}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const FormModal: React.FC<IFormModalProps> = ({
  open,
  header,
  setOpen,
  fields,
  formId,
  handleSubmitData,
  modalClassName,
  formClassName,
  submitButtonText,
  handleCloseModal,
  customComponent,
  enablefooterButtons = true,
  isLoading,
  headerClassName,
  footerClassName,
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className={cn("bg-white p-0 gap-0 border border-gray-200 rounded-md shadow-xl overflow-hidden", modalClassName)}>
        <DialogHeader className={cn("shrink-0", headerClassName)}>
          <DialogTitle className="text-lg font-bold font-nunito px-4 py-5">{header}</DialogTitle>
        </DialogHeader>
        <X
          size={16}
          onClick={() => {
            setOpen?.(false);
            handleCloseModal?.();
          }}
          className="absolute right-6 top-6 w-6 h-6 flex items-center justify-center text-white bg-gray-500 rounded-full p-1 cursor-pointer hover:bg-red-800"
        />

        {customComponent
          ? customComponent
          : fields && (
              <div className="border-t border-gray-100 z-90">
                <FormGenerator fields={fields} formID={formId} onSubmit={handleSubmitData} formClassName={cn("p-4", formClassName)} />
              </div>
            )}
        {isLoading && (
          <div className="absolute inset-0 z-100 bg-white/50 flex items-center justify-center">
            <Loader />
          </div>
        )}
        {enablefooterButtons && (
          <DialogFooter className={cn("flex justify-end gap-2 px-4 py-2 border-t border-gray-200", footerClassName)}>
            <Button
              variant="outline"
              className="p-2 border-gray-300 text-sm font-bold font-nunito"
              onClick={() => {
                setOpen?.(false);
                handleCloseModal?.();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form={formId} className="px-4 py-1 text-white font-nunito font-bold text-sm">
              {submitButtonText || "Save"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

const LogoutWarningDialog: React.FC<{
  open: boolean;
  countdown: number;
  onConfirm: () => void;
}> = ({ open, countdown, onConfirm }) => {
  return (
    <Dialog open={open}>
      <DialogContent className={cn("sm:max-w-[425px] border-0 focus:outline-none")}>
        <div className="text-center">
          <DialogHeader className={cn("m-auto flex h-12 w-12 items-center justify-center rounded-md border border-neutral-600/50")}>
            <ServerCrash size={20} className="text-red-500 " />
          </DialogHeader>
          <DialogTitle className={cn("my-4 text-center text-xl font-bold text-primary-800")}>Server Unavailable</DialogTitle>
          <DialogDescription className={cn("my-4 text-center text-base font-semibold text-primary-300")}>
            We are unable to connect to the server. You will be logged out in {countdown} second
            {countdown !== 1 ? "s" : ""}.
          </DialogDescription>
          <div className="flex items-center justify-center gap-4">
            <Button variant={"addItem"} className={cn("px-10 py-2.5 font-semibold")} onClick={onConfirm}>
              Logout Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PromptDialogue: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => void | Promise<void>;
}> = ({ open, onOpenChange, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[425px] border-0 focus:outline-none bg-white")}>
        <div className="text-center">
          <DialogHeader className={cn("m-auto flex h-12 w-12 items-center justify-center rounded-md border border-neutral-600/50")}>
            <LinkIcon size={20} className="text-primary " />
          </DialogHeader>
          <DialogTitle className={cn("my-4 text-center text-xl font-bold text-primary-800")}>
            <FormGenerator fields={[{ name: "link", label: "Enter your link", type: "text" }]} onSubmit={onSubmit} buttonText={"Save"} style="text-white text-base" />
          </DialogTitle>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const OTPModal: React.FC<OTPModalProps> = ({ open, setOpen, onOTPVerified }) => {
  const [disableRegenerate, setDisableRegenerate] = React.useState<boolean>(true);
  const [timer, setTimer] = React.useState<number | null>(0);
  const [getOTP, { isLoading, isFetching }] = useLazyGetOTPQuery();
  const [apiError, setApiError] = React.useState<string>("");
  const [verifyOTP, { isLoading: isVerifyLoading }] = useCreateDynamicDataWithoutFormDataMutation();
  React.useEffect(() => {
    if (open) {
      handleGenerateOTP();
    }
  }, [open === true]);

  const handleotp = async (values: { OTP: string }) => {
    setDisableRegenerate(true);
    setTimer(null);
    await verifyOTP({
      body: {
        OTP: values.OTP,
      },
      type: "pvt/verifyOTP",
    }).then((res: any) => {
      if (res.error) {
        const error = res.error as {
          data?: { Message: string };
          status?: number;
        };
        if (error.status === 400) {
          setApiError(res.error?.data?.message ?? "Something went wrong");
          setDisableRegenerate(false);
        }
      } else {
        onOTPVerified(res.data);
        setDisableRegenerate(true);
        setTimer(null);
      }
    });
  };

  const { handleSubmit, setFieldValue, values } = useFormik({
    initialValues: { OTP: "" },
    onSubmit: handleotp,
  });

  const handleGenerateOTP = async (e?: React.MouseEvent) => {
    setFieldValue("OTP", "");
    if (e) e.preventDefault(); // Prevent form submission or propagation
    await getOTP().then((res: any) => {
      if (res?.data?.Completed) {
        setDisableRegenerate(true);
        setTimer(300);
        setApiError("");
      }
    });
  };

  React.useEffect(() => {
    if (timer && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => (prev ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setDisableRegenerate(false);
      setTimer(null);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <Dialog open={open}>
      <DialogContent className="bg-white border border-gray-200 text-primary-800">
        {isLoading || isFetching ? (
          <div className="py-20 text-center flex justify-center">
            {/* <Loader2 className="w-16 h-16 text-primary animate-spin" /> */}
            <Loader />
          </div>
        ) : (
          <>
            <CloseIcon onClick={() => setOpen && setOpen(!open)} className="absolute right-6 top-6 cursor-pointer" />
            <form onSubmit={handleSubmit} className="text-center w-full space-y-5">
              <h1 className="text-2xl font-medium">Please Enter OTP</h1>
              <p>An OTP code has been sent to your email.</p>
              <OTPInput
                onChange={(e) => {
                  setFieldValue("OTP", e);
                  setApiError("");
                }}
              />
              {apiError && <div className={cn("text-[12px] text-red-500 mt-2")}>{apiError}</div>}
              <Button className="w-full bg-primary text-white p-2 !mb-0" type="submit" variant={"default"} disabled={values.OTP.length <= 5} loading={isVerifyLoading}>
                Submit
              </Button>
              <div className="flex items-center space-x-2 !mt-3">
                <Button className="w-1/2 p-1 bg-gray-500" onClick={() => setOpen && setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className={cn("w-1/2", disableRegenerate && timer ? "bg-gray-400 !cursor-not-allowed p-1" : "bg-primary-600 p-1")}
                  onClick={handleGenerateOTP} // Pass event to handler
                  disabled={disableRegenerate}
                  type="button" // Explicitly set type to prevent form submission
                >
                  {disableRegenerate && timer ? `Regenerate in ${formatTime(timer)}` : "Regenerate OTP"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface DataDetailModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  loading?: boolean;
  modalClassName?: string;
  details?: { label: string; value: React.ReactNode }[]; // For key/value rows
  tableHeaders?: { key: string; label: string; [k: string]: any }[]; // For table if needed
  tableData?: any[];
  footer?: React.ReactNode; // Custom footer if needed
}

const DataDetailModal: React.FC<DataDetailModalProps> = ({ open, setOpen, title, loading, modalClassName, details, tableHeaders, tableData, footer }) => {
  return (
    <Dialog open={open}>
      <DialogContent className={cn("bg-white p-0 space-y-0 border border-gray-200 rounded-md", modalClassName)}>
        <DialogHeader className={cn("shrink-0 bg-[#eee]")}>
          <DialogTitle className="text-lg font-bold font-nunito px-4 py-3">{title}</DialogTitle>
        </DialogHeader>
        <X
          size={16}
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 w-6 h-6 flex items-center justify-center text-white bg-red-500 rounded-full p-1 cursor-pointer hover:bg-red-800"
        />

        {loading ? (
          <div className="h-20 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="px-4 text-text-primary space-y-4 overflow-y-auto max-h-96">
            {/* Render key/value details */}
            {details?.length ? (
              <div className="space-y-2">
                {details.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="font-semibold">{item.label}:</span>
                    <span className="flex-1 break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Render table if provided */}
            {tableHeaders && tableData && <SimpleTable data={tableData} headers={tableHeaders} configClassName="!py-0 w-full" heightClassName="h-50" />}
          </div>
        )}

        <DialogFooter className={cn("flex justify-end gap-2 px-4 py-2 border-t border-gray-200 bg-[#eee]")}>
          {footer ? (
            footer
          ) : (
            <Button variant="default" className="p-2 bg-[#092c4c] text-white text-sm font-bold font-nunito" onClick={() => setOpen(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  EmailModal,
  FormModal,
  NotificationModal,
  LogoutWarningDialog,
  PromptDialogue,
  OTPModal,
  DataDetailModal,
};
