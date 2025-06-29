"use client"

import { Home, ClipboardList, Bolt, LogOutIcon } from "lucide-react"
import Image from "next/image";
import { User } from '@supabase/supabase-js'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { FaGithub } from "react-icons/fa"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { redirect, useRouter } from 'next/navigation'
import { Separator } from "./separator"
import Link from "next/link";
import { useOrganisation } from "@/hooks/usefetchOrg";

const items = [
    {
        title: "Repositories",
        url: "/home/repositories",
        icon: Home,
    },
    {
        title: "Reports",
        url: "/home/reports",
        icon: ClipboardList,
    },
    {
        title: "Configration",
        url: "/home/configration",
        icon: Bolt,
    }
]

export function AppSidebar() {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()
    const { organisation, loading} = useOrganisation(user?.user_metadata?.email)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                redirect('/authentication')
            }
            setUser(user)
        }
        fetchUser();
    }, []);

    if (!loading) {
        return (
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <div className="flex gap-2 items-center justify-center my-4">
                                    <FaGithub className="h-10 w-10 text-neutral-700" />
                                    <div className="flex flex-col">
                                        <p className="text-lg">
                                            {user?.user_metadata.full_name.length > 24 
                                                ? `${user?.user_metadata.full_name.slice(0, 24)}...` 
                                                : user?.user_metadata.full_name}
                                        </p>
                                        {organisation?.name.length &&
                                            <p>{organisation.name.length > 24 
                                                ? `${organisation?.name.slice(0, 24)}...`
                                                : organisation?.name
                                                }
                                            </p>
                                        }
                                    </div>
                                </div>
                                <Separator className="mb-4" />
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild size="lg">
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span className="text-[1rem]">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <div className="p-2 flex items-center gap-3 border m-2 rounded-lg">
                    {user?.user_metadata.avatar_url &&
                        <Image
                            src={user?.user_metadata.avatar_url}
                            alt="Profile"
                            width={42}
                            height={42}
                            className="rounded-full"
                        />
                    }
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between">
                            <p className="font-medium truncate">
                                {user?.user_metadata.full_name.length > 14 
                                    ? `${user?.user_metadata.full_name.slice(0, 14)}...` 
                                    : user?.user_metadata.full_name}
                            </p>
                            <button
                                onClick={handleLogout}
                                className="text-xs text-blue-400 hover:underline hover:bg-neutral-200 p-2 rounded-sm"
                            >
                                <LogOutIcon size={15} color="gray"/>
                            </button>
                        </div>
                        <p className="text-sm font-medium truncate">Admin</p>
                    </div>
                </div>
                <div className="p-2 flex items-center gap-3 border m-2 rounded-lg hover:bg-neutral-200">
                    <SidebarTrigger />
                    <p className="text-sm font-medium truncate">Collapse</p>
                </div>
            </Sidebar>
        )
    }
}