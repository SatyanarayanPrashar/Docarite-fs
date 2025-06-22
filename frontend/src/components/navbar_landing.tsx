import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar_landing() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = [
        // { href: "/readme-generator", text: "README Generator" },
        { href: "/pricing", text: "Pricing" },
        { href: "/authentication", text: "Login" },
    ];

    return (

            <div className="fixed top-0 left-1/2 z-50 -translate-x-1/2 bg-gradient-to-b from-white/10 to-white/5 px-6 py-4 text-zinc-800 backdrop-blur-xl w-full max-w-6xl border">
                <div className="flex items-center justify-between content-center">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        <Image
                            src="/logo_no_name.png"
                            alt="Logo"
                            width={25}
                            height={25}
                            priority
                        />
                        <p className="font-semibold tracking-wider">Docarite</p>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="text-sm transition-colors">
                                {link.text}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center justify-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="relative w-8 text-white mt-4"
                            aria-label="Toggle Menu"
                        >
                            <div className="absolute top-1/2 left-1/2 h-5 w-6 -translate-x-1/2 -translate-y-1/2 transform">
                                <span
                                    className={`absolute block h-0.5 w-full transform bg-current transition-transform duration-300 ease-in-out ${
                                        isMenuOpen ? "rotate-45" : "-translate-y-2"
                                    }`}
                                ></span>
                                <span
                                    className={`absolute block h-0.5 w-full transform bg-current transition-opacity duration-300 ease-in-out ${
                                        isMenuOpen ? "opacity-0" : ""
                                    }`}
                                ></span>
                                <span
                                    className={`absolute block h-0.5 w-full transform bg-current transition-transform duration-300 ease-in-out ${
                                        isMenuOpen ? "-rotate-45" : "translate-y-2"
                                    }`}
                                ></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
    );
}