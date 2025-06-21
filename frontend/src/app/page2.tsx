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

        <motion.div
          className="relative mt-7 sm:mt-13 w-full max-w-6xl mx-auto rounded-lg overflow-hidden"
          initial={{ opacity: 0, paddingTop: "20px" }}
          whileInView={{ opacity: 1, paddingTop: "0px" }}
          transition={{ ease: "linear", duration: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <video
            src="/hero.mp4"
            autoPlay
            muted
            className="w-full h-full mt-26 object-cover rounded-lg"
          />
        </motion.div>

        <p className="text-4xl font-bold mt-24 sm:mt-36 text-center px-4">AI Code Reviews</p>

        <div className="flex flex-col gap-10 mt-7 sm:mt-13 w-full max-w-6xl mx-auto">

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="relative flex w-full flex-col justify-between gap-6 rounded-[1rem] border border-white/50 bg-gradient-to-b from-white/20 to-white/5 p-6 backdrop-blur-[10px] sm:p-8 md:flex-row lg:h-[19rem] lg:w-[70%] lg:p-10 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)]">
              <div className="pointer-events-none absolute inset-0 rounded-[1rem] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.2),transparent)]" />
              <div className="z-10 flex w-full flex-col gap-4 md:w-[40%] lg:w-[30%]">
                <p className="text-2xl font-semibold sm:text-3xl">Tailored reviews.<br /> Every time.</p>
                <p className="text-sm text-white/80 sm:text-base">
                  Adaptive feedback tailored to your coding style and team dynamics, driven by continuous learning.
                </p>
              </div>
              <div className="relative z-10 mt-6 h-full w-full md:mt-0 md:w-[57%]">
                <Image
                  className="rounded-2xl object-cover"
                  src="/demo.png"
                  alt="Demo Preview"
                  fill
                />
              </div>
            </div>

            <div className="relative flex h-auto w-full flex-col justify-between gap-4 overflow-hidden rounded-[1rem] border border-white/50 bg-gradient-to-b from-white/20 to-white/5 p-6 text-white backdrop-blur-[10px] sm:p-8 lg:h-[19rem] lg:w-[30%] lg:p-10 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)]">
              <div className="pointer-events-none absolute inset-0 rounded-[1rem] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent)]" />
              <div className="z-10">
                <p className="text-2xl font-semibold">Spot bugs. Fix instantly.</p>
                <p className="mt-2 text-sm text-white/80 sm:text-base">
                  Context-aware reviews and instant fixes help catch issues earlier and ship confidently.
                </p>
              </div>
              {/* <Image src="/asset1.png" alt="Readme Preview" width={150} height={150} className="z-10 h-auto w-1/2 self-center object-contain sm:w-2/3" /> */}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse gap-10">
            <div className="relative flex w-full flex-col justify-between gap-6 rounded-[1rem] border border-white/50 bg-gradient-to-b from-white/20 to-white/5 p-6 backdrop-blur-[10px] sm:p-8 md:flex-row lg:h-[14.5rem] lg:w-[70%] lg:p-10 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)]">
              <div className="absolute inset-0 pointer-events-none rounded-[1rem] bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent)]" />
              <div className="flex flex-col gap-4 w-full z-10">
                <p className="text-2xl sm:text-3xl font-semibold">Smart summaries. Clear insights.</p>
                <p className="text-white/80">
                  Whether it&apos;s a tiny tweak or a major feature, get crystal-clear PR summaries for every change.
                </p>
              </div>
              {/* <div className="relative w-full md:w-[60%] h-64 md:h-full z-10 mt-6 md:mt-0">
                    <Image
                        className="rounded-2xl object-cover"
                        src="/demo.png"
                        alt="Readme Preview"
                        fill
                    />
                </div> */}
            </div>
            <div className="relative flex w-full flex-col justify-between gap-6 rounded-[1rem] border border-white/50 bg-gradient-to-b from-white/20 to-white/5 p-6 backdrop-blur-[10px] sm:p-8 md:flex-row lg:h-[14.5rem] lg:w-[70%] lg:p-10 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.2),0_20px_30px_rgba(0,0,0,0.2)]">
              <div className="absolute inset-0 pointer-events-none rounded-[1rem] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent)]" />
              <div className="z-10">
                <p className="text-2xl font-semibold">Know what has been changed and the impact!</p>
                <p className="text-white/80 mt-2">
                  See the list of changed files and a one-line description.
                </p>
              </div>
              {/* <Image src="/demo.png" alt="Readme Preview" width={300} height={180} className="rounded-xl object-cover w-full h-auto self-center mt-4 z-10" /> */}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mt-20 sm:mt-28 w-full max-w-6xl">
          <div className="relative w-full h-80 sm:h-96 lg:w-1/2 lg:h-[32rem]">
            <Image
              className="rounded-2xl object-cover shadow-2xl"
              src="/vibecoding.png"
              alt="Developer coding with focus"
              fill
            />
          </div>
          <div className="flex flex-col gap-6 w-full lg:w-1/2 text-center lg:text-left">
            <p className="text-3xl sm:text-4xl font-bold">
              We back you, so you can Vibe code
            </p>
            <ul className="flex flex-col gap-7 mt-4 text-base sm:text-lg text-white/80">
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>
                  Looks for security lapses and potential vulnerabilities.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>
                  Ensures code quality and adherence to best practices.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>
                  Provides intelligent suggestions to optimize performance and
                  improve maintainability.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 mt-24 sm:mt-36 w-full max-w-6xl mx-auto">
          <p className="text-4xl font-bold text-center">Your Security is Our Priority</p>
          <p className="text-white/80 mb-5">We take security, privacy, and compliance seriously.</p>
          <div className="flex flex-col lg:flex-row gap-8 w-full">
            
            <div className="relative flex flex-col items-center text-center gap-6">
              <div className="relative w-full h-20 sm:h-32 lg:w-[30rem] lg:h-[9rem]">
                <Image
                  className="object-cover"
                  src="/datamask.png"
                  alt="Developer coding with focus"
                  fill
                />
              </div>
              <div className="z-10">
                <p className="text-2xl font-semibold">We mask all sensitive data</p>
                <p className="mt-2 text-white/80">
                  Any sensitive information is automatically detected and masked before it&apos;s sent to LLMs for analysis.
                </p>
              </div>
            </div>
            <div className="relative flex flex-col items-center text-center gap-6 ">
              <div className="relative w-full h-20 sm:h-32 lg:w-[9rem] lg:h-[9rem]">
                <Image
                  className="rounded-2xl object-cover"
                  src="/database.png"
                  alt="Developer coding with focus"
                  fill
                />
              </div>
              <div className="z-10">
                <p className="text-2xl font-semibold">We do not store any of your code</p>
                <p className="mt-2 text-white/80">
                  Your code is processed in-memory and never saved to disk, ensuring complete confidentiality.
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

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6 text-green-400 flex-shrink-0 mt-1"

  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
