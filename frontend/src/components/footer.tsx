import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer_landing() {
    return (
        <footer className="w-full max-w-7xl mx-auto border-t border-white/20 px-6 sm:px-8 py-10 mt-8 sm:mt-14">
            <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-start md:text-left">
                <div className="flex flex-col items-center md:flex-1 md:items-start">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo_no_name.png"
                            alt="docarite logo"
                            width={40}
                            height={40}
                            priority
                        />
                        <p className="font-bold text-3xl sm:text-4xl">Docarite</p>
                    </Link>
                    <p className="mt-4 max-w-xs text-sm text-white/60">
                        The AI-powered platform for seamless code documentation and review.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-3 md:flex-1 md:items-start">
                    <p className="mb-2 font-semibold text-white">Product</p>
                    <Link href="/features" className="text-white/60 transition-colors hover:text-white">Features</Link>
                    <Link href="/faq" className="text-white/60 transition-colors hover:text-white">FAQ</Link>
                    <Link href="/blog" className="text-white/60 transition-colors hover:text-white">Blog</Link>
                    <Link href="/changelog" className="text-white/60 transition-colors hover:text-white">Changelog</Link>
                </div>

                <div className="flex flex-col items-center gap-3 md:flex-1 md:items-start">
                    <p className="mb-2 font-semibold text-white">Company</p>
                    <Link href="/contact" className="text-white/60 transition-colors hover:text-white">Contact Us</Link>
                    <Link href="/pricing" className="text-white/60 transition-colors hover:text-white">Pricing</Link>
                    <Link href="/terms" className="text-white/60 transition-colors hover:text-white">Terms & Conditions</Link>
                    <Link href="/privacy" className="text-white/60 transition-colors hover:text-white">Privacy Policy</Link>
                </div>
            </div>

            <div className="mt-12 border-t border-white/20 pt-8 text-center text-sm text-white/50">
                <p>&copy; {new Date().getFullYear()} Docarite. All rights reserved.</p>
            </div>
        </footer>
    );
}