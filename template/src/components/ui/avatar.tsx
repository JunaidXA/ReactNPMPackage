import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
import { ProfileAvatarProps } from "../types";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  fallback,
  onClick,
  src,
  avatarClassname,
  avatarFallbackClassname,
  avatarImgClassname,
}) => {
  return (
    <Avatar className={cn(avatarClassname)} onClick={onClick}>
      {src && <AvatarImage src={src} className={cn(avatarImgClassname)} />}
      <AvatarFallback className={cn(avatarFallbackClassname)}>
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
};

export const AvatarGroup = ({
  members,
  className,
  avatarClassname
}: {
  members: { src: string; fallback: string }[];
  className?: string
  avatarClassname?: string
}) => {
  const visible = members.slice(0, 3);
  const extra = members.length - 3;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((member, i) => (
        <Avatar key={i} className={cn("w-7 h-7 transition-transform duration-200 hover:scale-120 hover:z-10", avatarClassname)}>
          <AvatarImage src={member.src} alt={member.fallback} />
          <AvatarFallback>{member.fallback}</AvatarFallback>
        </Avatar>
      ))}
      {extra > 0 && (
        <div className={cn("w-7 h-7 rounded-full bg-gray-200 text-xs text-center flex items-center justify-center font-semibold border-2 border-white", avatarClassname)}>
          +{extra}
        </div>
      )}
    </div>
  );
};


export { Avatar, AvatarImage, AvatarFallback, ProfileAvatar };
