"use client";

import { CheckCheck, Copy, RefreshCw } from "lucide-react";
import { useState, useTransition } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MemberRole } from "@prisma/client";
import { generateNewInviteCode } from "@/actions/server";
import { toast } from "sonner";
import { TooltipComponent } from "../globals/tooltip";

interface props {
  serverId: string,
  inviteCode: string,
  role: MemberRole,
  children: React.ReactNode
}

export const InviteDialog = ({ serverId, inviteCode, role, children }: props) => {

  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition()

  const inviteUrl = `${process.env.NEXT_PUBLIC_URL}/${serverId}/invite/${inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = () => {
    if (role === 'GUEST') {
      return;
    }
    startTransition(() => {
      generateNewInviteCode(serverId)
        .then((data) => {
          if (data.success) {
            toast.success(data.message)
          } else {
            toast.error(data.message)
          }
        }).catch(() => toast.error("Something went wrong"))
    })
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Label
            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
          >
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 pointer-events-none"
              value={inviteUrl}
            />
            <TooltipComponent label="Copy link" position="top" variant="primary">
              <Button disabled={isPending} onClick={onCopy} variant='primary' size="icon">
                {copied
                  ? <CheckCheck className="w-4 h-4" />
                  : <Copy className="w-4 h-4" />
                }
              </Button>
            </TooltipComponent>
          </div>
        {role !== 'GUEST' && (
            <Button
              onClick={onNew}
              disabled={isPending}
              variant="link"
              size="sm"
              className="text-sm text-zinc-500 mt-4"
            >
              Generate a new link
              <RefreshCw className="w-4 h-4 ml-2" />
            </Button>
        )}
        </div>
      </DialogContent>
    </Dialog>
  )
}