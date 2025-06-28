"use client"

import Comming_soon_tag from '@/components/comming_soon';
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion';
import Image from "next/image";
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { FaGithub } from "react-icons/fa";
import { FaGitlab } from 'react-icons/fa6';

export default function Home() {
    
    const signInWithGitHub = async () => {
        console.log(`${process.env.CALLBACK_URL} || ${window.location.origin}/auth/callback`,)
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
            //   redirectTo: `https://docarite.com/auth/callback`,
              redirectTo: `http://localhost:3000//auth/callback`,
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
            }
        }
        fetchUser();
    }, []);
    
    return (
        <div className="relative h-[100vh] w-screen bg-blue-100 flex items-center justify-center p-4">
            <div className="relative w-xl h-full flex p-10 flex-col gap-4 justify-center items-centr">
                <div className="flex gap-2 items-center">
                    <Image
                        className=""
                        src="/logo_no_name.png"
                        alt="Next.js logo"
                        width={30}
                        height={25}
                        priority
                    />
                    <p className="text-2xl font-bold">Docarite</p>
                </div>
                <h2 className="text-lg text-zinc-600">
                    Supercharge your team to ship faster with the most advanced AI code reviews.
                </h2>
                <h2 className="text-lg text-zinc-600">
                    We need the read and write access to issues and pull requests, you can manage the permissions later from Github settings.
                </h2>
                <button onClick={signInWithGitHub} className="w-full mt-2 px-8 py-3 flex items-center justify-center gap-4 rounded-2xl border border-white/50 text-white backdrop-blur-[10px] bg-gradient-to-br from-blue-600/80 to-blue-600/60 shadow-lg hover:from-blue-600/90 hover:to-blue-600/70 transition-all hover:cursor-pointer">
                    <FaGithub size={24}/>
                    Sign up with GitHub
                </button>
                <button onClick={()=>{}} className="w-full px-8 py-3 flex items-center justify-center gap-4 rounded-2xl border border-white/20 text-white backdrop-blur-[10px] bg-gradient-to-br from-blue-600/20 to-blue-600/40 shadow-lg transition-all">
                    <FaGitlab size={24}/>
                    Sign up with GitLab
                    <Comming_soon_tag />
                </button>
            </div>
        </div>
    );
}
