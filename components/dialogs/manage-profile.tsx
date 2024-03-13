"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, UserCog } from "lucide-react";
import { useState } from "react";
import { baseUserType } from "@/lib/type";
import { PersonalTab } from "../globals/personal-tab";
import { CredentialsTab } from "../globals/credential-tab";

export const UserModal = ({ user, children }: {user: baseUserType, children: React.ReactNode}) => {

    const [activeTab, setActiveTab] = useState('personal')
    const onChange = (value: string) => {
        setActiveTab(value)
    }
    const TabData = [
        {
            icon: User,
            title: 'personal',
        },
        {
            icon: UserCog,
            title: 'credentials',
        }
    ]
    return (
        <Dialog>

            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="rounded-md max-w-3xl p-3 md:p-6">

                <DialogHeader>
                    <DialogTitle className="text-center tracking-wider font-semibold">
                        Profile Settings
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue={activeTab} className="w-full mt-4 md:mt-2" onValueChange={onChange}>
                    
                    <TabsList className="w-full relative">
                        {TabData.map((data, i) => (
                            <TabsTrigger value={data.title} className="w-full gap-2 px-0" key={i}>
                                <data.icon className="w-5 h-5" />
                                {activeTab === data.title && (
                                    <span className="inline text-sm font-medium absolute -translate-y-8 bg-primary text-background rounded py-1 px-2 md:hidden">{data.title}</span>
                                )}
                                <span className="hidden md:inline">{data.title}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                   <TabsContent value="personal">
                        <PersonalTab initialImage={user.image} initialName={user.name} />
                   </TabsContent>

                   <TabsContent value="credentials">
                        <CredentialsTab id={user.id} initialEmail={user.email} initialUsername={user.username} />
                   </TabsContent>

                </Tabs>

            </DialogContent>

        </Dialog>
    )
}