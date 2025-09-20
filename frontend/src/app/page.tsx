"use client";

import Image from "next/image";
import Navbar_landing from "@/components/navbar_landing";
import { motion } from 'framer-motion';
import Footer_landing from "@/components/footer";
import HeroSection from "@/components/hero_section";
import Link from "next/link";
import { FaLock } from "react-icons/fa";

export default function Home() {

    return (
        <div className="flex flex-col min-h-screen min-w-screen items-center relative z-10 overflow-x-hidden">
            <Navbar_landing />
            <div className="relative w-full bg-blue-100 flex flex-col items-center p-4 pb-20 pt-40 shadow-[0_20px_100px_20px_rgba(214,231,254,1)]">
                <motion.div
                    className="absolute top-[15%] left-[10%] w-[15%] h-[25%] z-0 blur-2xl"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <div className="w-full h-full bg-blue-300/50 rounded-full" />
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

                <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">
                    <HeroSection />
                </div>

                <motion.div className="relative mt-10 sm:mt-20 z-20 w-[24rem] sm:w-[25rem] md:w-[35rem] lg:w-[50rem] 2xl:w-[60rem] aspect-[50/34] mx-auto rounded-lg overflow-hidden"
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
                            className="object-contain"
                        />
                    </div>
                </motion.div>
                
                {/* <div className="relative z-20 w-full max-w-lg mt-10 md:mt-20 lg:mt-32 p-4 md:p-8 bg-white/14 backdrop-blur-xl rounded-4xl border border-white/10 shadow-lg"> */}
                    {/* The "Walkthrough" content from the images goes here */}
                    <div className="relative w-full h-full">
                         <Image
                            src="/docarite-walkthrough.png"
                            fill
                            alt="Docarite Walkthrough"
                            className="object-contain"
                        />
                    </div>
                {/* </div> */}

            </div>
            
            <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto py-20 sm:py-64 lg:py-[12rem] px-4 border-l border-r pb-10">
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

            <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto py-10 sm:py-14 lg:py-[6rem] px-4 border-l border-r">
                <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-zinc-900 text-center">
                &quot;Give your Devs <br /> an unfair advantage&quot;
                </p>
                <div className="flex flex-col items-center gap-3">
                    <Link href="/authentication" className="px-8 py-2 rounded-full border border-white/50 text-white backdrop-blur-[10px] bg-gradient-to-br from-blue-600/80 to-blue-600/60 shadow-lg hover:from-blue-600/90 hover:to-blue-600/70 transition-all">
                        Get Started
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto p-10 sm:p-14 lg:p-[6rem] border-l border-r pb-10 bg-blue-900">
                <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
                    Your data stays <span className="text-orange-400">confidential</span>
                </p>
                <p className="text-xl text-white">
                    We take security, privacy, and compliance seriously.
                </p>
                <div className="flex gap-4 items-center text-white/80">
                    <FaLock />
                    <p>
                        Review environments spin up instantly and disappear without a trace.
                    </p>
                </div>
                <div className="flex gap-4 items-center text-white/80">
                    <FaLock />
                    <p>
                        End-to-end encryption protects your code during reviews with zero data retention post-review.
                    </p>
                </div>
            </div>

            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center px-4 mt-20 py-16 md:py-24">
                <div className="flex flex-col text-center lg:text-left">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                        Pay Only for What You Use
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 max-w-lg mx-auto lg:mx-0">
                        Enable features exactly when you need them. You will only be charged for the resources you actually consume.
                    </p>

                    <div className="mt-8 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 h-6 w-6 mt-1 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                ✓
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">No Monthly Lock-ins</h3>
                                <p className="text-slate-500">Forget paying for unused features. Activate tools only when you need them.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 h-6 w-6 mt-1 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                ✓
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Feature-Level Control</h3>
                                <p className="text-slate-500">Turn individual features on or off based on your workflow—you&apos;re always in control.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 h-6 w-6 mt-1 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                ✓
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Flexible & Fair</h3>
                                <p className="text-slate-500">Whether you&apos;re reviewing 2 pull requests or 200, you&apos;re charged only for what you use.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 h-6 w-6 mt-1 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                ✓
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Perfect for Teams of All Sizes</h3>
                                <p className="text-slate-500">From solo developers to large teams—scale your usage without scaling costs unnecessarily.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center py-6">
                    <div className="relative h-[16rem] md:h-[20rem] w-full">
                        <Image
                            src="/price_action.png"
                            fill
                            alt="Smart Issue Sync"
                            className="object-contain p-8"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-7/12 flex-shrink-0">
                        <h2 className="text-2xl sm:text-7xl font-bold text-slate-900 tracking-tight">
                            Get Started Today
                        </h2>
                        <p className="mt-4 text-xl text-slate-600 max-w-md mx-auto lg:mx-0">
                            Supercharge your team to ship faster.
                        </p>
                        <div className="flex items-center gap-3">
                            <Link href="/authentication" className="mt-6 px-8 py-2 rounded-full border border-white/50 text-white backdrop-blur-[10px] bg-gradient-to-br from-blue-700/80 to-blue-700/60 shadow-lg hover:from-blue-700/90 hover:to-blue-700/70 transition-all">
                                Get Started
                            </Link>
                            <Link href="/contact-us" className="mt-6 px-8 py-2 rounded-full border border-zinc-600/20 text-zinc-600 backdrop-blur-[10px] bg-gradient-to-br from-white/80 to-white/60 shadow-lg hover:from-sky-100/90 hover:to-sky-100/70 transition-all">
                                Contact us
                            </Link>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">
                            2-click signup with GitHub/GitLab
                        </p>
                    </div>
                    <div className="relative w-full lg:w-5/12 aspect-video lg:aspect-[50/44]">
                        <Image
                            src="/get_started.png"
                            fill
                            alt="An illustration showing the product interface"
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
            <Footer_landing />
        </div>
    );
}