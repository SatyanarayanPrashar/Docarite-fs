"use client";

import Image from "next/image";
import Navbar_landing from "@/components/navbar_landing";
import { motion } from 'framer-motion';
import Footer_landing from "@/components/footer";
import HeroSection from "@/components/hero_section";

export default function Home() {

    return (
        <div className="flex flex-col min-h-screen min-w-screen items-center relative z-10 overflow-x-hidden">
            <Navbar_landing />
            <div className="relative h-[100vh] w-full bg-blue-100 flex items-center justify-center p-4">
                <motion.div
                    className="absolute top-[15%] left-[10%] w-[15%] h-[25%] z-0 blur-2xl"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <div className="w-full h-full bg-blue-300/50 rounded-full"></div>
                </motion.div>

                <motion.div
                    className="absolute bottom-[10%] right-[15%] w-[20%] h-[30%] z-0 blur-3xl"
                    animate={{ y: [0, 25, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <div className="w-full h-full bg-indigo-200/50 rounded-full"></div>
                </motion.div>

                <motion.div
                    className="absolute top-[20%] right-[25%] w-[12%] h-[20%] z-0 blur-2xl"
                    animate={{ x: [-15, 15, -15] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <div className="w-full h-full bg-sky-200/50 rounded-full"></div>
                </motion.div>

                <div className="relative z-10 w-full max-w-6xl bg-white/14 flex flex-col items-center backdrop-blur-xl rounded-4xl border border-white/10 shadow-[2px] p-10 md:p-20">
                    <HeroSection />
                </div>

                <motion.div className="absolute top-160 z-20 w-[24rem] sm:w-[25rem] md:w-[35rem] lg:w-[50rem] 2xl:w-[60rem] aspect-[50/34] mx-auto rounded-lg overflow-hidde"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 40,
                        damping: 10,
                    }}
                >
                    <div className="relative w-full h-full">
                        <Image
                            src="/hero_img.png"
                            fill
                            alt="docarite_hero_image"
                        />
                    </div>
                </motion.div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto pt-40 sm:pt-64 lg:pt-[32rem] px-4 border-l border-r pb-10">
                <p className="text-base sm:text-lg md:text-xl text-zinc-600 text-center">
                    No more manual grunt work in your dev pipeline.
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-zinc-900 text-center">
                    Docarite automates everything <br className="hidden sm:block" /> around your code platform.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl mx-auto border">
                <div className="flex flex-col items-center py-6 border-b md:border-r">
                    <div className="relative h-[16rem] md:h-[20rem] w-[85%]">
                        <Image
                            src="/demo.png"
                            fill
                            alt="AI-Powered PR Reviews"
                            className="object-contain p-8"
                        />
                    </div>
                    <p className="py-2 px-6 w-full text-zinc-900 text-xl md:text-2xl border-l-4 border-blue-600">AI-Powered PR Reviews</p>
                    <p className="px-7 text-zinc-600 text-base">Get smart, contextual feedback on pull requests — no manual review needed.</p>
                </div>

                <div className="flex flex-col items-center py-6 border-b">
                    <div className="relative h-[16rem] md:h-[20rem] w-[85%]">
                        <Image
                            src="/headstart.png"
                            fill
                            alt="Headstart for Developers"
                            className="object-contain p-8"
                        />
                    </div>
                    <p className="py-2 px-6 w-full text-zinc-900 text-lg md:text-xl border-l-4 border-blue-600">Headstart for Developers</p>
                    <p className="px-7 text-zinc-600 text-base pb-10">Docarite reads your issues and auto-suggests how to tackle them with its code awareness — saving time and reducing back-and-forth.</p>
                </div>

                <div className="flex flex-col items-center py-6 border-b md:border-b-0 md:border-r">
                    <div className="relative h-[16rem] md:h-[20rem] w-[75%]">
                        <Image
                            src="/git_platforms.png"
                            fill
                            alt="Works Across Git Platforms"
                            className="object-contain p-8"
                        />
                    </div>
                    <p className="py-2 px-6 w-full text-zinc-900 text-lg md:text-xl border-l-4 border-blue-600">Works Across Git Platforms</p>
                    <p className="px-7 w-full text-zinc-600 text-base">Seamlessly supports GitHub, GitLab, Azure Repos, and more.</p>
                </div>

                <div className="flex flex-col items-center py-6">
                    <div className="relative h-[16rem] md:h-[20rem] w-full">
                        <Image
                            src="/smart_sync.png"
                            fill
                            alt="Smart Issue Sync"
                            className="object-contain p-8"
                        />
                    </div>
                    <p className="py-2 px-6 w-full text-zinc-900 text-lg md:text-xl border-l-4 border-blue-600">Smart Issue Sync</p>
                    <p className="px-7 text-zinc-600 text-base pb-7">Links code with issues from GitHub, Jira, and more to keep development aligned with priorities.</p>
                </div>
            </div>

            <Footer_landing />
        </div>
    );
}
