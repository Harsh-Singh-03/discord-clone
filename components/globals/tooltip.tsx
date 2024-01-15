"use client"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import React from "react"

interface props {
    label: string,
    position?: 'right' | 'left' | 'top' | 'bottom'
    children: React.ReactNode,
    variant?: 'danger' | 'primary' | 'classic'
}
export const TooltipComponent = ({ label, children, position, variant }: props) => {
    return (
        <TooltipProvider delayDuration={200} >
            <Tooltip>
                <TooltipTrigger>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={position} className={cn(
                    "font-medium text-sm",
                    variant && variant === 'danger' && 'bg-rose-500 text-white',
                    variant && variant === 'primary' && 'bg-indigo-500 text-white'
                )}>
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    )
}