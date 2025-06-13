"use client"

import { supabase } from '@/lib/supabase'
import Image from "next/image";
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { FaGithub } from "react-icons/fa";

export default function Home() {

    const signInWithGitHub = async () => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          })
          if (error) throw error
        } catch (error) {
          console.error(error)
        }
    }

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                redirect('/home')
                return;
            }
        }
        fetchUser();
    }, []);
    
    return (
        <div className="flex flex-col min-h-screen justify-center items-center text-white relative z-10">
            <div className="relative w-xl h-full flex p-10 flex-col gap-4 justify-center items-center">
                <div className="flex gap-2 items-center">
                    <Image
                        className=""
                        src="/logo_no_name.png"
                        alt="Next.js logo"
                        width={40}
                        height={25}
                        priority
                    />
                    <p className="text-2xl font-bold">Docarite</p>
                </div>
                <p className="text-white/80 text-[1rem]">
                    Welcome to Docarite
                </p>
                <h2 className="text-xl text-center text-white/80">
                    Supercharge your team to ship faster with the most advanced AI code reviews.
                </h2>
                <h2 className="text-xl text-center text-white/80">
                    Manage all your repos from a single place, and get personalized code reviews that adapt to your coding habits.
                </h2>
                <button onClick={signInWithGitHub} className="w-full mt-10 px-8 py-4 flex items-center justify-center gap-4 rounded-full border border-white/20 text-white backdrop-blur-[10px] bg-gradient-to-br from-white/20 to-white/10 shadow-[0_8px_20px_rgba(255,255,255,0.1)] hover:from-white/30 hover:to-white/20 transition-all">
                    <FaGithub size={24}/>
                    Sign up with GitHub
                </button>
            </div>
        </div>
    );
}
