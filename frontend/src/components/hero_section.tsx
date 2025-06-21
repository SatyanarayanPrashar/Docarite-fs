"use client";

import { useRef } from 'react';
import Link from 'next/link';
import { FaGithubAlt, FaGit, FaGitAlt } from 'react-icons/fa';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { FaGitlab } from "react-icons/fa6";

const AnimatedIcon = ({
    icon: Icon,
    className,
    delay,
    scrollProgress,
}: {
    icon: React.ComponentType;
    className: string;
    delay: number;
    scrollProgress: MotionValue<number>;
}) => {
    // Transform scroll progress (0 to 1) into animation values
    const scale = useTransform(scrollProgress, [0, 0.8], [1, 0.5]); // Shrink to 50% size
    const opacity = useTransform(scrollProgress, [0, 0.6], [1, 0]); // Fade out during the first 60% of the scroll
    const filter = useTransform(scrollProgress, val => `blur(${val * 10}px)`); // Increase blur from 3px to 13px

    return (
        <motion.div
            className={`fixed text-7xl ${className}`}
            style={{
                scale,
                opacity,
                filter,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 120,
                damping: 10,
                delay: delay, // Stagger the animations
            }}
        >
            <Icon />
        </motion.div>
    );
};

export default function HeroSection() {
    const targetRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const textScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    return (
        <div ref={targetRef} className="relative z-10 w-11/12 max-w-4xl bg-white/1 flex flex-col items-center backdrop-blur-xl rounded-3xl border border-white/10 shadow-x p-10 md:p-20">

            {/* Animated Icons */}
            <AnimatedIcon icon={FaGithubAlt} className="-left-5 -top-8 rotate-[-30deg]" delay={0.1} scrollProgress={scrollYProgress} />
            <AnimatedIcon icon={FaGit} className="-right-5 top-8 rotate-[30deg]" delay={0.2} scrollProgress={scrollYProgress} />
            <AnimatedIcon icon={FaGitlab} className="-right-5 -bottom-8 rotate-[-30deg]" delay={0.3} scrollProgress={scrollYProgress} />
            <AnimatedIcon icon={FaGitAlt} className="left-5 bottom-8 rotate-[30deg]" delay={0.4} scrollProgress={scrollYProgress} />

            {/* The text content is wrapped in its own motion.div to apply the scale transformation */}
            <motion.div
                className="flex flex-col items-center"
                style={{ scale: textScale }}
            >
                <h1 className="text-4xl md:text-6xl font-bold text-center text-zinc-900 leading-tight">
                    Review Smarter. <br /> Ship Faster.
                </h1>

                <p className="mt-6 text-base md:text-lg text-zinc-700 text-center max-w-2xl">
                    Let AI handle the pull requests — Docarite finds bugs, suggests improvements, and saves your team hours on code reviews.
                </p>
            </motion.div>

            <div className="flex flex-col items-center gap-3">
                <Link href="/authentication" className="mt-6 px-8 py-2 rounded-full border border-white/50 text-white backdrop-blur-[10px] bg-gradient-to-br from-blue-600/80 to-blue-600/60 shadow-lg hover:from-blue-600/90 hover:to-blue-600/70 transition-all">
                    Get Started
                </Link>
            </div>
        </div>
    );
}