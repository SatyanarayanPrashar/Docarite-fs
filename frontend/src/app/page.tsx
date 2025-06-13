"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import Navbar_landing from "@/components/navbar_landing";

export default function Home() {
  const [tool, setTool] = useState("README Generator");

  return (
    <div className="flex flex-col min-h-screen items-center text-white relative z-10">
      <Navbar_landing />
      <h1 className="text-6xl font-extrabold text-center mt-48">Cut Code Review Time <br /> & Bugs in Half. Instantly.</h1>
      <h2 className="mt-6 text-xl text-center text-white/80">
        Supercharge your team to ship faster with the most advanced AI <br /> code reviews.
      </h2>

      <Link href="/authentication" className="mt-10 px-8 py-4 rounded-full border border-white/20 text-white backdrop-blur-[10px] bg-gradient-to-br from-white/20 to-white/10 shadow-[0_8px_20px_rgba(255,255,255,0.1)] hover:from-white/30 hover:to-white/20 transition-all">
        Get Started
      </Link>

      <div className="flex flex-col gap-10 mt-32">
        {/* CARD ROW 1 */}
        <div className="flex gap-10 h-[25rem] w-[80vw]">
          <div className="relative w-[70%] h-full flex p-12 gap-6 justify-between rounded-[2rem] border border-white/20 text-white backdrop-blur-[10px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white/20 to-white/5 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none rounded-[2rem] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.2),transparent)]" />
            <div className="flex flex-col gap-4 w-[30%] z-10">
              <p className="text-3xl font-semibold">Tailored reviews.<br /> Every time.</p>
              <p className="text-white/80">
                Personalized and adaptive code feedback powered by continuous learning from your coding habits and team needs.
              </p>
            </div>
            <div className="relative w-[60%] h-full z-10">
              <Image
                className="rounded-2xl object-cover"
                src="/readme.png"
                alt="Readme Preview"
                fill
              />
            </div>
          </div>

          <div className="relative w-[30%] h-full flex p-10 flex-col gap-4 justify-between rounded-[2rem] border border-white/20 text-white backdrop-blur-[10px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white/20 to-white/5 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none rounded-[2rem] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent)]" />
            <p className="text-2xl font-semibold">Spot bugs. Fix instantly.</p>
            <p className="text-white/80">
              Context-aware reviews and instant fixes help catch issues earlier and ship confidently.
            </p>
            <Image src="/readme.png" alt="Readme Preview" width={300} height={180} className="rounded-xl object-cover" />
          </div>
        </div>

        {/* CARD ROW 2 */}
        <div className="flex gap-10 h-[25rem] w-[80vw]">
          <div className="relative w-[30%] h-full flex p-10 flex-col gap-4 justify-between rounded-[2rem] border border-white/20 text-white backdrop-blur-[10px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white/20 to-white/5 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none rounded-[2rem] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent)]" />
            <p className="text-2xl font-semibold">Know what has been changed and the impact!</p>
            <p className="text-white/80">
              See the list of changed files <br /> and a one-line description.
            </p>
            <Image src="/readme.png" alt="Readme Preview" width={300} height={180} className="rounded-xl object-cover" />
          </div>
          <div className="relative w-[70%] h-full flex p-12 gap-6 justify-between rounded-[2rem] border border-white/20 text-white backdrop-blur-[10px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white/20 to-white/5 overflow-hidden">
            <div className="relative w-[60%] h-full z-10">
              <Image
                className="rounded-2xl object-cover"
                src="/readme.png"
                alt="Readme Preview"
                fill
              />
            </div>
            <div className="flex flex-col gap-4 w-[30%] z-10">
              <p className="text-3xl font-semibold">Smart summaries. Clear insights.</p>
              <p className="text-white/80">
                Whether it&aos;s a tiny tweak or a major feature, get crystal-clear PR summaries for every change.
              </p>
            </div>
          </div>
        </div>

        {/* CARD ROW 3 */}
        <div className="flex gap-10 h-[40rem] w-[80vw] mb-20">
          <div className="relative w-[70%] h-full flex p-12 gap-6 justify-between rounded-[2rem] border border-white/20 text-white backdrop-blur-[10px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white/20 to-white/5 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none rounded-[2rem] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.2),transparent)]" />
            <div className="flex flex-col gap-4 w-[30%] z-10">
              <p className="text-3xl font-semibold">Ship faster with agentic Chat!</p>
              <p className="text-white/80">
                Get advice or kick off multi-step tasks with a simple chat. From generating code and docstrings to creating issues and resolving feedback, our agentic Chat helps you ship faster. The more you interact, the more it learns.
              </p>
            </div>
            <div className="relative w-[60%] h-full z-10">
              <Image
                className="rounded-2xl object-cover"
                src="/readme.png"
                alt="Readme Preview"
                fill
              />
            </div>
          </div>

          <div className="relative w-[30%] h-full flex p-10 flex-col gap-4 rounded-[2rem] border border-white/20 text-white backdrop-blur-[10px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white/20 to-white/5 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none rounded-[2rem] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent)]" />
            <Image src="/readme.png" alt="Readme Preview" width={300} height={180} className="rounded-xl object-cover" />
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-semibold">More signal. Less noise.</p>
              <p className="text-white/80">
                Automatically runs popular static analyzers, linters, and security tools combined with Gen-AI's advanced reasoning models. Code graph analysis enhances context for deeper code understanding, delivering best-in-class signal-to-noise ratio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
