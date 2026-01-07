import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { SpinnerIcon } from "../svg";
import { ButtonProps } from "../types";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-0 focus-visible:border-0 focus-visible:ring-ring/50 focus-visible:ring-[0px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground ",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-border-gray hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-[#092C4C] font-nunito text-[14px] leading-[17px] font-bold hover:text-[#fe9f43] hover:underline",
        eyeIcon: " hover:bg-accent hover:text-accent-foreground",
        addItem:
          "bg-primary-600 text-white border border-[#663399] text-base leading-1 hover:bg-transparent hover:text-primary-600",
        pagination: "bg-gray-50 rounded-lg border border-gray-50 text-gray-800",
        error:
          "bg-brand-500 text-white border border-brand-500 hover:bg-transparent hover:text-brand-700 hover:text-brand-700",
        confirmBtn:
          "bg-primary-600 border border-primary-600 rounded-md text-white",
        cancelBtn:
          "bg-transparent border-gray-300 border rounded-md text-black",
        textBtn: "text-normal font-nunito font-medium",
        labelBtn: "!text-primary",
        solidBtn:
          "bg-primary-300 border border-primary-300 text-white hover:bg-background-hover hover:border-background-hover w-full cursor-pointer text-md font-nunito leading-sm font-semibold",
        hoverBtn:
          "text-white w-full cursor-pointer text-md font-nunito leading-md bg-primary-300 border-primary-300 hover:text-primary-300 font-bold border p-2.5",
        filterBtn:
          "bg-white border border-border-gray px-3 py-3 rounded-lg text-text-primary hover:bg-primary hover:text-white text-sm leading-sm font-nunito focus-visible:border",
        calenderBtn: "hover:bg-primary hover:text-white",
        showMoreBtn:
          "px-6 py-2 bg-primary border-primary text-white text-md font-medium ",
      },
      size: {
        default: "",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-6",
        mailSize: "w-full rounded-2xl border m-auto",
        error: "py-3 px-4 w-40",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      pre,
      post,
      icon,
      loading,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // const Variant: { [key: string]: string } = {
    //   default: "bg-white",
    //   outline: "bg-brand",
    // };

    // const possible = [
    //   "text-primary-400",
    //   "bg-primary-700",
    //   "bg-primary-600",
    //   "bg-primary-500",
    //   "bg-primary-400",
    //   "bg-red-700",
    //   "bg-red-600",
    //   "bg-red-500",
    //   "bg-red-400",
    //   "bg-neutral-700",
    //   "bg-neutral-600",
    //   "bg-neutral-500",
    //   "bg-neutral-400",
    //   "bg-slate-700",
    //   "bg-slate-600",
    //   "bg-slate-500",
    //   "bg-slate-400",
    //   "border-primary-700",
    //   "border-primary-600",
    //   "border-primary-500",
    //   "border-red-700",
    //   "border-red-600",
    //   "border-red-500",
    //   "border-neutral-700",
    //   "border-neutral-600",
    //   "border-neutral-500",
    //   "border-slate-700",
    //   "border-slate-600",
    //   "border-slate-500",
    //   "text-primary-500",
    //   "text-primary-400",
    //   "text-red-500",
    //   "text-red-400",
    //   "text-neutral-500",
    //   "text-neutral-400",
    //   "text-slate-500",
    //   "text-slate-400",
    //   "hover:bg-primary-500",
    //   "hover:bg-primary-400",
    // "hover:bg-primary-300",
    //   "hover:bg-red-500",
    //   "hover:bg-red-400",
    //   "hover:bg-neutral-500",
    //   "hover:bg-neutral-400",
    //   "hover:bg-slate-500",
    //   "hover:bg-slate-400",
    //   "hover:border-primary-400",
    //   "hover:border-primary-500",
    //   "hover:border-primary-600",
    //   "hover:border-red-400",
    //   "hover:border-red-500",
    //   "hover:border-red-600",
    //   "hover:border-neutral-400",
    //   "hover:border-neutral-500",
    //   "hover:border-neutral-600",
    //   "hover:border-slate-400",
    //   "hover:border-slate-500",
    //   "hover:border-slate-600",
    //   "disabled:hover:text-primary-700",
    //   "disabled:hover:text-red-700",
    //   "disabled:hover:text-neutral-700",
    //   "disabled:hover:text-slate-700",
    // "border-text-textColor-bodyColor"
    // ];

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {loading ? (
          <SpinnerIcon />
        ) : (
          <>
            {pre && <span className="pre pr-0">{pre}</span>} {props.children}
            {post && <span className="post pl-0">{post}</span>} {icon && icon}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";
export { Button, buttonVariants };
