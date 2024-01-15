"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { PopoverClose } from "@radix-ui/react-popover"

export function ModeToggle() {
  const { setTheme } = useTheme()
  const closeRef = React.useRef<HTMLButtonElement>(null)
  return (
    <Popover >
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="mx-auto w-12 h-12 rounded-full bg-transparent border-0">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" side="right" className="w-auto p-2 min-w-32">
        <div className="flex flex-col">
          <Button variant='ghost' className="w-full justify-start px-3"
            onClick={() => {
              setTheme("light");
              closeRef.current?.click();
            }}
          >
            Light
          </Button>
          <Button variant='ghost' className="w-full justify-start px-3"
            onClick={() => {
              setTheme("dark");
              closeRef.current?.click();
            }}
          >
            Dark
          </Button>
        </div>
        <PopoverClose className="hidden">
          <Button ref={closeRef} >Close</Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
