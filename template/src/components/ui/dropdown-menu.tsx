import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { Badge, Button, ProfileAvatar } from "@/components";
import { FilterMenuProps, IMenuProps } from "../types";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.SubContent>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>>(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align="end"
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>>(
  ({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
);
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>>(
  ({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
);
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => <DropdownMenuPrimitive.Label ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)} {...props} />);
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Separator>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>>(
  ({ className, ...props }, ref) => <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
);
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />;
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

const Menu: React.FC<IMenuProps> = ({ className, menuItems, onChange, title, subtitle, image, post, menuType, dropdownContentclass, notificationsCount, username, role }) => {
  const handleAction = (e: any) => {
    onChange && onChange(e);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(className)}>
          <div className={cn("flex items-center justify-between")}>
            {title && subtitle && (
              <div className={cn("me-1 md:me-4 hidden md:block")}>
                <h1 className={cn("text-base text-left font-semibold")}>{title}</h1>
                <h4 className="text-sm text-right text-[#89879f]">{subtitle}</h4>
              </div>
            )}

            <ProfileAvatar src={image ?? ""} avatarClassname="w-7 h-7 rounded-none" avatarFallbackClassname="" avatarImgClassname="!object-contain" fallback={username} />

            {post && (
              <div
                onClick={() => {
                  console.log("notifications clicked!");
                }}
                className="relative flex h-9 w-9 text-[0.813rem] items-center justify-center"
              >
                {post}
                {true && (
                  <Badge
                    variant="text"
                    value={notificationsCount}
                    className={`absolute right-1 -top-[0.125rem] border-0 bg-primary-600 rounded-full font-bold text-[0.75em] text-white px-[0.65em] py-[0.35em] leading-none`}
                  />
                )}
              </div>
            )}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          // transition
          // anchor="bottom end"

          className={cn("mt-2 p-0 z-[1001] rounded-md  bg-white border-0 shadow-none", dropdownContentclass)}
        >
          {menuType === "Notifications"
            ? menuItems &&
              menuItems.map((item, index) => (
                <DropdownMenuItem key={index} className="group p-0 text-primary-300 hover:bg-gray-50 text-[0.813rem] font-normal rounded-none cursor-pointer">
                  <div
                    className="flex items-center p-0 h-[4.5rem] border-b border-[#dee2e6] w-full"
                    onClick={() => {
                      handleAction(item.action);
                    }}
                  >
                    <div className={cn(`bg-[#eee] h-full w-[2.75rem] flex items-center justify-center text-${item.color}-200`)}>
                      <div>{item.icon}</div>
                    </div>
                    <div className="flex-grow p-[0.25rem] px-[0.75rem]">
                      <div className="m-0 flex items-center justify-between">
                        <span className="text-[#47404f] font-normal">{item.label}</span>
                        <Badge
                          variant="text"
                          value={item.status}
                          className={`bg-${item.color} rounded-full ml-[0.25rem] mr-[0.25rem] border-0 font-bold text-[0.75em] text-white px-[0.65em] py-[0.35em] leading-[0.8]`}
                        />
                        <span className="flex-grow" />
                        <span className="text-xs text-primary-300 m-auto">{item.time} agos</span>
                      </div>
                      <div className="m-0 text-xs text-primary-300">{item.description}</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            : menuType === "Profile"
            ? menuItems && (
                <div className="p-2 pb-0 min-w-52">
                  <div className="flex bg-[#F9FAFB] items-center space-x-2 rounded-md p-4 mb-2">
                    <ProfileAvatar src={image ?? ""} avatarClassname="w-7 h-7 rounded-none" avatarFallbackClassname="" avatarImgClassname="!object-contain" />
                    <div className="font-nunito">
                      <h1 className="text-md font-medium text-text-primary leading-[1.2]">{username}</h1>
                      <p className="text-md text-text-secondary">{role}</p>
                    </div>
                  </div>
                  {menuItems.map((menu, index) => (
                    <DropdownMenuItem
                      key={index}
                      className={cn(
                        "group py-[0.42rem] px-6 text-text-primary bg-white hover:bg-gray-50 active:bg-primary/50 active:text-white text-[0.813rem] font-normal rounded-none cursor-pointer",
                        menu.action === "logout" && "border-t-[1px] border-border-gray my-2 "
                      )}
                      onClick={() => handleAction(menu.action)}
                    >
                      <div className={cn("flex items-center justify-between space-x-2", menu.action === "logout" ? "text-red-500" : "text-text-secondary text-sm")}>
                        <span>{menu.icon}</span> <h2 className="font-semibold">{menu.label}</h2>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )
            : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const FilterMenu: React.FC<FilterMenuProps> = ({ filterKey, label, items, onSelect, selected, triggerClassName, contentClassName, disabled }) => {
  const selectedItem = items?.find((item) => item.value === selected);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled} asChild className={cn("justify-between shadow-lg disabled:opacity-100", triggerClassName)}>
        <Button icon={<i className="ti ti-chevron-down"></i>} variant="filterBtn" className={cn(selected && "bg-primary text-white rounded-lg")}>
          {selectedItem?.label || label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("w-full !min-w-[var(--radix-dropdown-menu-trigger-width)] bg-white border-border-gray overflow-auto", contentClassName)}>
        {items &&
          items.map((item, index) => (
            <DropdownMenuItem key={index} onClick={() => onSelect(filterKey, item.value)} className="text-sm leading-sm text-text-secondary hover:bg-primary hover:text-white">
              {item.label}
              <Check className={cn("h-4 w-4", selected === item.value ? "opacity-100" : "opacity-0")} />
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  Menu,
  FilterMenu,
};
