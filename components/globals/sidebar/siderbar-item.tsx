"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { TooltipComponent } from "../tooltip";
import Link from "next/link";


interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
};

export const SidebarItem = ({
  id,
  imageUrl,
  name
}: NavigationItemProps) => {
  const params = useParams();

  return (
    <TooltipComponent
      position="right"
      label={name}
      variant="primary"
    >
      <Link
       href={`/servers/${id}`}
        className="group relative flex items-center"
      >
        <div className={cn(
          "absolute left-0 bg-primary rounded-r-full transition-all w-1",
          params?.serverId !== id && "group-hover:h-6",
          params?.serverId === id ? "h-9" : "h-2"
        )} />
        <div className={cn(
          "relative group flex mx-3 h-12 w-12 rounded-full group-hover:rounded-2xl transition-all overflow-hidden",
          params?.serverId === id && "bg-primary/10 text-primary rounded-2xl"
        )}>
          <Image
            fill
            priority
            src={imageUrl}
            className="object-cover"
            alt="Channel"
          />
        </div>
      </Link>
    </TooltipComponent>
  )
}