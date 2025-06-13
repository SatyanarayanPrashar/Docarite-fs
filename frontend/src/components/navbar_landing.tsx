import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar_landing() {
    return (
        <div className="fixed top-1 z-50 w-2/3 mt-8 flex justify-between items-center px-8 py-4 rounded-full border border-white/30 text-white backdrop-blur-md shadow-xl bg-gradient-to-b from-white/10 to-white/5">
            <Link href="/">
                <div className="flex gap-2 items-center">
                    <Image
                        className=""
                        src="/logo_no_name.png"
                        alt="Next.js logo"
                        width={25}
                        height={10}
                        priority
                    />
                    <p>Docarite</p>
                </div>
            </Link>
            <div className="flex gap-4">
                <Link href="/readme-generator">
                    <p className="">README Generator</p>
                </Link>
                <div className="flex flex-col">
                    <p className="">AI Code Documentation</p>
                </div>
                <div className="flex flex-col">
                    <p className="">API Documentation</p>
                </div>
            </div>
        </div>
    );
}
