"use client"
import { cva, type VariantProps } from "class-variance-authority";

import { cn, stringToColor } from "@/lib/utils";
import { 
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";


const avatarSizes = cva(
  "",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        md: 'h-12 w-12',
        lg: "h-14 w-14",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface UserAvatarProps
  extends VariantProps<typeof avatarSizes> {
  placeholder: string;
  imageUrl?: string;
};

export const UserAvatar = ({
  placeholder,
  imageUrl,
  size,
}: UserAvatarProps) => {
  
  // const color = stringToColor(placeholder)

  return (
    <div className="relative">
      <Avatar
        className={cn(
          avatarSizes({ size })
        )}
      >
        <AvatarImage src={imageUrl || ""} className="object-cover" />
        <AvatarFallback className={cn(
          "uppercase font-semibold",
          size === 'lg' && 'text-xl'
        )}
        >
          {placeholder[0]}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

