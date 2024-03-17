"use client";

import { MemberRole } from "@prisma/client";
import { Check, LogOut, MoreHorizontal, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "../user-avatar";
import { Separator } from "@/components/ui/separator";
import { InviteDialog } from "@/components/dialogs/invite";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateNewChannel } from "@/components/dialogs/create-channel";
import { ServerWithMembersWithProfiles } from "@/lib/type";
import { LeaveModal } from "@/components/dialogs/leave-modal";
import { DeleteServerModal } from "@/components/dialogs/delete-server-modal";
import { CreateCategory } from "@/components/dialogs/create-category";
import { Fragment } from "react";
import { ManageMemberDialog } from "@/components/dialogs/manage-member";
import { MemberProvider } from "@/components/context/member-context";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles
    role?: MemberRole;
};

export const ServerHeader = ({
    role, server
}: ServerHeaderProps) => {
    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;
    // console.log(server);
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    className="w-full rounded-none border-0 h-12 text-base font-semibold" variant='ghost'>
                    {server.name}
                    <MoreHorizontal className="h-5 w-5 ml-auto" />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="rounded-t-2xl bg-light1 dark:bg-dark1">
                <div className="w-full max-w-screen-sm mx-auto p-4 space-y-4 h-auto">
                    <UserAvatar placeholder={server.name} imageUrl={server.imageUrl} size='lg' />
                    <div>
                        <div className="flex items-center gap-3 mb-0.5">
                            <h4 className="font-semibold text-lg md:text-xl truncate">{server.name}</h4>
                            <Check className="w-4 h-4 p-[3px] bg-emerald-500 text-white rounded-md stroke-[4px]" />
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">{server.bio ? server.bio : 'Server kept a secret about its bio.'}</p>
                    </div>
                    <div className="flex items-center text-[10px] md:text-xs gap-2 text-muted-foreground">
                        <span className="px-2 py-0.5 bg-muted rounded-full">Community server</span>
                        <span>{server._count.Category} {server._count.Category > 1 ? 'channels' : 'channel'}</span>
                        <span>{server._count.members} {server._count.members > 1 ? 'members' : 'member'}</span>
                        <span className="lowercase">You: @{role}</span>
                    </div>
                    <Separator />
                    <div className="w-full rounded-md bg-[#F2F3F5] dark:bg-[#2B2D31] overflow-hidden p-2">
                        {isModerator && (
                            <Fragment>
                                <InviteDialog inviteCode={server.inviteCode} serverId={server.id} role={role}>
                                    <Button size='lg' variant='ghost' className="w-full   flex gap-3 justify-start    hover:text-muted-foreground text-indigo-600 dark:text-indigo-400">
                                        Invite People
                                        <UserPlus className="h-4 w-4 ml-auto" />
                                    </Button>
                                </InviteDialog>
                                <CreateNewChannel serverId={server.id} categories={server.Category} >
                                    <Button size='lg' variant='ghost' className="w-full   flex gap-3 justify-start  hover:text-muted-foreground">
                                        Create Channel
                                        <PlusCircle className="h-4 w-4 ml-auto" />
                                    </Button>
                                </CreateNewChannel>
                            </Fragment>
                        )}
                        {isAdmin && (
                            <Fragment>

                                <CreateCategory serverId={server.id}>
                                    <Button size='lg' variant='ghost' className="w-full   flex gap-3 justify-start  hover:text-muted-foreground">
                                        Create Category
                                        <PlusCircle className="h-4 w-4 ml-auto" />
                                    </Button>
                                </CreateCategory>

                                <Button size='lg' variant='ghost' className="w-full   flex gap-3 justify-start  hover:text-muted-foreground">
                                    Server Settings
                                    <Settings className="h-4 w-4 ml-auto" />
                                </Button>
                                
                                <MemberProvider>
                                    <ManageMemberDialog serverId={server.id} serverName={server.name} you={server.members[0]} member_count={server._count.members}>
                                        <Button size='lg' variant='ghost' className="w-full   flex gap-3 justify-start   hover:text-muted-foreground">
                                            Manage Members
                                            <Users className="h-4 w-4 ml-auto" />
                                        </Button>
                                    </ManageMemberDialog>
                                </MemberProvider>

                                <Separator className="my-2 bg-muted-foreground/10" />

                                <DeleteServerModal serverId={server.id} serverName={server.name}>
                                    <Button size='lg' variant='ghost' className="w-full   flex gap-3 justify-start hover:text-muted-foreground text-rose-500">
                                        Delete Server
                                        <Trash className="h-4 w-4 ml-auto" />
                                    </Button>
                                </DeleteServerModal>

                            </Fragment>
                        )}
                        {!isAdmin && (
                            <Fragment>
                                {role !== 'GUEST' && (
                                    <Separator className="my-2 bg-muted-foreground/10" />
                                )}
                                <LeaveModal serverId={server.id} serverName={server.name}>
                                    <Button size='lg' variant='ghost' className="w-full   flex gap-3 justify-start hover:text-muted-foreground text-rose-500">
                                        Leave Server
                                        <LogOut className="h-4 w-4 ml-auto" />
                                    </Button>
                                </LeaveModal>
                            </Fragment>
                        )}
                    </div>
                    <DrawerClose className="flex w-full justify-end">
                        <Button variant='ghost'>Close</Button>
                    </DrawerClose>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export const ServerHeaderSkeleton = () => (
    <div className="w-full p-4 flex justify-between items-center">
        <Skeleton className="w-[70%] h-4 rounded-md" />
        <Skeleton className="w-5 h-4 rounded-md" />
    </div>
)