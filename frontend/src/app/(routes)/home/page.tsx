"use client"

import { supabase } from '@/lib/supabase'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function HomePage() {
    const router = useRouter()
    const [loggedin, setLoggedIn] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                redirect('/authentication')
            }
            setLoggedIn(true)
            setUser(user)
        }
        fetchUser();
    }, []);

    return (
        <div className="flex w-full flex-col items-center gap-4 p-4 text-white">
            
        </div>
    )
}
