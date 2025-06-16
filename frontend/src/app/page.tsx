"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar_landing from "@/components/navbar_landing";
import { motion } from 'framer-motion';
import Footer_landing from "@/components/footer";

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen items-center text-white relative z-10 overflow-x-hidden">
      <Navbar_landing />
      <div className="fixed top-0 left-0 w-screen h-screen -z-10">
        <Image
          src="/background2.png"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>
      <motion.div
        className="fixed top-[17%] left-1/4 w-[50%] h-[50%] md:w-[32%] md:h-[45%] md:left-1/3 -z-10 blur-[4px]"
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Image
          src="/bg_logo.png"
          alt="Background Logo"
          fill
          priority
          className="object-contain"
        />
      </motion.div>

      <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mt-50 sm:mt-64 md:mt-58">Review Smarter. Ship Faster.</h1>
        <h2 className="mt-6 text-lg sm:text-xl text-center text-white/80 max-w-3xl mx-auto">
          Let AI handle the pull requests — Docarite finds bugs, suggests improvements, and saves your team hours on code reviews.
        </h2>

        <div className="flex justify-center">
          <Link href="/authentication" className="mt-10 px-8 py-2 rounded-full border border-white/50 text-white backdrop-blur-[10px] bg-gradient-to-br from-white/20 to-white/10 shadow-[0_8px_20px_rgba(255,255,255,0.1)] hover:bg-blue-600 transition-all">
            Get Started
          </Link>
        </div>

        <p className="text-4xl font-bold mt-24 sm:mt-36 text-center px-4">AI Code Reviews</p>

        <div className="flex flex-col gap-10 mt-7 sm:mt-13 w-full max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="relative flex h-auto w-full flex-col justify-between gap-6 rounded-[1rem] border border-white/50 bg-gradient-to-b from-white/20 to-white/5 p-6 backdrop-blur-[10px] sm:p-8 md:flex-row lg:h-[25rem] lg:w-[70%] lg:p-10 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)]">
              <div className="pointer-events-none absolute inset-0 rounded-[1rem] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.2),transparent)]" />
              <div className="z-10 flex w-full flex-col gap-4 md:w-[40%] lg:w-[30%]">
                <p className="text-2xl font-semibold sm:text-3xl">Tailored reviews.<br /> Every time.</p>
                <p className="text-sm text-white/80 sm:text-base">
                  Personalized and adaptive code feedback powered by continuous learning from your coding habits and team needs.
                </p>
              </div>
              <div className="relative z-10 mt-6 h-64 w-full md:mt-0 md:h-full md:w-[60%]">
                <Image
                  className="rounded-2xl object-cover"
                  src="/demo.png"
                  alt="Demo Preview"
                  fill
                />
              </div>
            </div>

            <div className="relative flex h-auto w-full flex-col justify-between gap-4 overflow-hidden rounded-[1rem] border border-white/50 bg-gradient-to-b from-white/20 to-white/5 p-6 text-white backdrop-blur-[10px] sm:p-8 lg:h-[25rem] lg:w-[30%] lg:p-10 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)]">
              <div className="pointer-events-none absolute inset-0 rounded-[1rem] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent)]" />
              <div className="z-10">
                <p className="text-2xl font-semibold">Spot bugs. Fix instantly.</p>
                <p className="mt-2 text-sm text-white/80 sm:text-base">
                  Context-aware reviews and instant fixes help catch issues earlier and ship confidently.
                </p>
              </div>
              <Image src="/asset1.png" alt="Readme Preview" width={150} height={150} className="z-10 h-auto w-1/2 self-center object-contain sm:w-2/3" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse gap-10">
            <div className="relative w-full lg:w-[70%] h-auto lg:h-[25rem] flex flex-col md:flex-row-reverse p-8 sm:p-12 gap-6 justify-between rounded-[1rem] border border-white/50 text-white backdrop-blur-[10px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white/20 to-white/5 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none rounded-[1rem] bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent)]" />
                <div className="flex flex-col gap-4 w-full md:w-[40%] lg:w-[30%] z-10">
                    <p className="text-2xl sm:text-3xl font-semibold">Smart summaries. Clear insights.</p>
                    <p className="text-white/80">
                    Whether it&apos;s a tiny tweak or a major feature, get crystal-clear PR summaries for every change.
                    </p>
                </div>
                <div className="relative w-full md:w-[60%] h-64 md:h-full z-10 mt-6 md:mt-0">
                    <Image
                        className="rounded-2xl object-cover"
                        src="/demo.png"
                        alt="Readme Preview"
                        fill
                    />
                </div>
            </div>
            <div className="relative w-full lg:w-[30%] h-auto lg:h-[25rem] flex p-8 sm:p-10 flex-col gap-4 justify-between rounded-[1rem] border border-white/50 text-white backdrop-blur-[10px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white/20 to-white/5 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none rounded-[1rem] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent)]" />
                <div className="z-10">
                    <p className="text-2xl font-semibold">Know what has been changed and the impact!</p>
                    <p className="text-white/80 mt-2">
                    See the list of changed files and a one-line description.
                    </p>
                </div>
                <Image src="/demo.png" alt="Readme Preview" width={300} height={180} className="rounded-xl object-cover w-full h-auto self-center mt-4 z-10" />
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-10 mb-20 sm:mb-32">
            <div className="relative w-full lg:w-[70%] h-auto lg:h-[30rem] flex flex-col md:flex-row p-8 sm:p-12 gap-6 justify-between rounded-[1rem] border border-white/50 text-white backdrop-blur-[10px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white/20 to-white/5 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-[1rem] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.2),transparent)]" />
              <div className="flex flex-col gap-4 w-full md:w-[40%] lg:w-[30%] z-10">
                <p className="text-2xl sm:text-3xl font-semibold">Ship faster with agentic Chat!</p>
                <p className="text-white/80">
                  Get advice or kick off multi-step tasks with a simple chat. From generating code and docstrings to creating issues and resolving feedback, our agentic Chat helps you ship faster. The more you interact, the more it learns.
                </p>
              </div>
              <div className="relative w-full md:w-[60%] h-64 md:h-full z-10 mt-6 md:mt-0">
                <Image
                  className="rounded-2xl object-cover"
                  src="/demo.png"
                  alt="Demo Preview"
                  fill
                />
              </div>
            </div>

            <div className="relative w-full lg:w-[30%] h-auto lg:h-[30rem] flex p-8 sm:p-10 flex-col gap-4 justify-between rounded-[1rem] border border-white/50 text-white backdrop-blur-[10px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white/20 to-white/5 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-[1rem] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent)]" />
              <Image src="/demo.png" alt="Readme Preview" width={300} height={180} className="rounded-xl object-cover w-full h-auto self-start z-10" />
              <div className="flex flex-col gap-2 z-10">
                <p className="text-2xl font-semibold">More signal. Less noise.</p>
                <p className="text-white/80">
                  Automatically runs popular static analyzers, linters, and security tools combined with Gen-AI&apos;s advanced reasoning models. Code graph analysis enhances context for deeper code understanding, delivering best-in-class signal-to-noise ratio.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer_landing />
      </div>
    </div>
  );
}