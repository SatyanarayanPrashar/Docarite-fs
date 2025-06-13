"use client"

import { supabase } from '@/lib/supabase'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function HomePage() {
    const router = useRouter()
    const [loggedin, setLoggedIn] = useState(false)
    const [user, setUser] = useState<any>(null)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    useEffect(() => {
        async function fetchUser() {
            console.log("here")
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                redirect('/authentication')
                return;
            }
            setLoggedIn(true)
            setUser(user)
            console.log('User:', user)
        }
        fetchUser();
    }, []);

    return (
        <div className="flex w-full flex-col items-center gap-4 p-4 text-white">
            {loggedin ? (
                <p>User ID: {user.id}</p>
            ) : (
                <p>You are not logged in.</p>
            )}
            <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-blue-600 border rounded hover:bg-blue-50"
            >
                Sign Out
            </button>
        </div>
    )
}
